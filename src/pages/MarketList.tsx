import { useState } from "react"
import { Link } from "react-router-dom"
import { UST, UUSD } from "../constants"
import Tooltip from "../lang/Tooltip.json"
import { lt, gt, div, minus } from "../libs/math"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { AssetInfoKey, PriceKey } from "../hooks/contractKeys"
import useAssetStats from "../statistics/useAssetStats"
import useYesterday, { calcChange } from "../statistics/useYesterday"
import Table from "../components/Table"
import Change from "../components/Change"
import AssetIcon from "../components/AssetIcon"
import Formatted from "../components/Formatted"
import Percent from "../components/Percent"
import Search from "../components/Search"
import { TooltipIcon } from "../components/Tooltip"
import { Type } from "./Market"
import styles from "./MarketList.module.scss"

interface Item extends ListedItem {
  terraswap: { price: string; change?: string }
  oracle: { price: string; change?: string }
  liquidity?: string
  volume?: string
}

interface Sorter {
  label: string
  compare: (a: Item, b: Item) => number
}

const Sorters: Dictionary<Sorter> = {
  TOPTRADING: {
    label: "Top Trading",
    compare: (a, b) => (lt(a.volume ?? 0, b.volume ?? 0) ? 1 : -1),
  },
  MARKETCAP: {
    label: "Market Cap",
    compare: (a, b) => (lt(a.liquidity ?? 0, b.liquidity ?? 0) ? 1 : -1),
  },
  TOPGAINER: {
    label: "Top Gainer",
    compare: (a, b) =>
      lt(a.terraswap.change ?? 0, b.terraswap.change ?? 0) ? 1 : -1,
  },
  TOPLOSER: {
    label: "Top Loser",
    compare: (a, b) =>
      lt(a.terraswap.change ?? 0, b.terraswap.change ?? 0) ? -1 : 1,
  },
}

const MarketList = () => {
  const infoKey = AssetInfoKey.LIQUIDITY
  const keys = [PriceKey.PAIR, PriceKey.ORACLE, infoKey]

  const { listed } = useContractsAddress()
  const { find } = useContract()
  const yesterday = useYesterday()
  const { volume, liquidity } = useAssetStats()
  const { data } = useRefetch(keys)

  const [input, setInput] = useState("")
  const [sorter, setSorter] = useState("TOPTRADING")

  const dataSource = listed
    .filter(({ name, symbol }) =>
      [name, symbol].some((l) => l.toLowerCase().includes(input.toLowerCase()))
    )
    .filter(({ token }) => gt(liquidity?.[token] ?? 0, 0))
    .map((item) => {
      const { token } = item
      const pair = find(PriceKey.PAIR, token)
      const oracle = find(PriceKey.ORACLE, token)
      const premium = minus(div(pair, oracle), 1)

      return {
        ...item,
        terraswap: {
          price: pair,
          change: calcChange({
            today: pair,
            yesterday: yesterday[PriceKey.PAIR][token],
          }),
        },
        oracle: {
          price: oracle,
          change: calcChange({
            today: oracle,
            yesterday: yesterday[PriceKey.ORACLE][token],
          }),
        },
        premium,
        liquidity: liquidity?.[token] ?? "0",
        volume: volume?.[token] ?? "0",
      }
    })
    .sort(Sorters[sorter].compare)

  return !data ? null : (
    <>
      <Search value={input} onChange={(e) => setInput(e.target.value)}>
        <select value={sorter} onChange={(e) => setSorter(e.target.value)}>
          {Object.entries(Sorters).map(([key, { label }]) => (
            <option value={key} key={key}>
              {label}
            </option>
          ))}
        </select>
      </Search>

      <Table
        columns={[
          {
            key: "symbol",
            title: "Ticker",
            render: (symbol, { token, name }) => {
              const to = { hash: Type.BUY, state: { token } }

              return (
                <div className={styles.asset}>
                  <AssetIcon symbol={symbol} />
                  <Link className={styles.title} to={to}>
                    <h1 className={styles.symbol}>{symbol}</h1>
                    <p className={styles.name}>{name}</p>
                  </Link>
                </div>
              )
            },
            bold: true,
          },
          {
            key: "volume",
            title: (
              <TooltipIcon content={Tooltip.TopTrading.Volume}>
                Volume
              </TooltipIcon>
            ),
            render: (value) => (
              <Formatted symbol={UUSD} config={{ integer: true }}>
                {value}
              </Formatted>
            ),
            align: "right",
          },
          {
            key: "liquidity",
            title: (
              <TooltipIcon content={Tooltip.TopTrading.Liquidity}>
                Liquidity
              </TooltipIcon>
            ),
            render: (value) => (
              <Formatted symbol={UUSD} config={{ integer: true }}>
                {value}
              </Formatted>
            ),
            align: "right",
          },
          {
            key: "oracle.price",
            title: (
              <TooltipIcon content={Tooltip.TopTrading.Oracle}>
                Oracle Price
              </TooltipIcon>
            ),
            render: (price) =>
              gt(price, 0) && <Formatted unit={UST}>{price}</Formatted>,
            align: "right",
            narrow: ["right"],
          },
          {
            key: "terraswap",
            title: "Terraswap Price",
            render: ({ price }, { terraswap: { change } }) =>
              gt(price, 0) && (
                <>
                  <Formatted unit={UST}>{price}</Formatted>
                  <Change align="right">{change}</Change>
                </>
              ),
            align: "right",
            narrow: ["right"],
          },
          {
            key: "premium",
            dataIndex: "premium",
            title: "Spread",
            render: (value) => <Percent>{value}</Percent>,
            align: "right",
          },
        ]}
        dataSource={dataSource}
      />
    </>
  )
}

export default MarketList
