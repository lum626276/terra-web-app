import { useState } from "react"
import { UST } from "../constants"
import { lt, gt, div, minus, number } from "../libs/math"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { AssetInfoKey, PriceKey } from "../hooks/contractKeys"
import useAssetStats from "../statistics/useAssetStats"
import useYesterday, { calcChange } from "../statistics/useYesterday"
import Table from "../components/Table"
import Change from "../components/Change"
import Formatted from "../components/Formatted"
import Percent from "../components/Percent"
import Search from "../components/Search"
import AssetItem from "../components/AssetItem"
import ChartContainer from "../containers/ChartContainer"
import { MarketType } from "../types/Types"

interface Item extends ListedItem {
  terraswap: { price: string; change?: string }
  oracle: { price: string; change?: string }
  liquidity?: string
  volume?: string
  history: PriceHistoryItem[]
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
  const { volume, liquidity, history } = useAssetStats()
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
        history: history?.[token] ?? [],
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
        rows={({ token }) => ({
          to: { hash: MarketType.BUY, state: { token } },
        })}
        columns={[
          {
            key: "token",
            title: "Ticker",
            render: (token) => <AssetItem token={token} />,
            bold: true,
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
            title: "Premium",
            render: (value) => <Percent>{value}</Percent>,
            align: "right",
          },
          {
            key: "history",
            dataIndex: "history",
            title: "1D Chart",
            render: (history: PriceHistoryItem[]) => (
              <ChartContainer
                datasets={history?.map(({ timestamp, price }) => ({
                  x: timestamp,
                  y: number(price),
                }))}
                compact
              />
            ),
          },
        ]}
        dataSource={dataSource}
      />
    </>
  )
}

export default MarketList
