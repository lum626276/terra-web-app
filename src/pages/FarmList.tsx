import { useState } from "react"
import { MIR, UUSD } from "../constants"
import { lt, gt, div, minus } from "../libs/math"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { AssetInfoKey, BalanceKey, PriceKey } from "../hooks/contractKeys"
import useAssetStats from "../statistics/useAssetStats"
import useYesterday, { calcChange } from "../statistics/useYesterday"
import Table from "../components/Table"
import Percent from "../components/Percent"
import AssetItem from "../components/AssetItem"
import Icon from "../components/Icon"
import Formatted from "../components/Formatted"
import Search from "../components/Search"
import { FarmType } from "../types/Types"
import styles from "./FarmList.module.scss"

interface Item extends ListedItem {
  liquidity?: string
  volume?: string
  totalStaked?: string
}

interface Sorter {
  label: string
  compare: (a: Item, b: Item) => number
}

const Sorters: Dictionary<Sorter> = {
  TOPFARMING: {
    label: "Top Farming",
    compare: (a, b) => (lt(a.totalStaked ?? 0, b.totalStaked ?? 0) ? 1 : -1),
  },
}

const FarmList = () => {
  const balanceKey = BalanceKey.LPSTAKED

  const keys = [
    PriceKey.PAIR,
    PriceKey.ORACLE,
    balanceKey,
    AssetInfoKey.LIQUIDITY,
    AssetInfoKey.LPTOTALSTAKED,
  ]

  const { listed, getSymbol } = useContractsAddress()
  const { find } = useContract()
  const yesterday = useYesterday()
  const { volume, liquidity, apr } = useAssetStats()
  const { data } = useRefetch(keys)

  const [input, setInput] = useState("")
  const [sorter, setSorter] = useState("TOPFARMING")

  const dataSource = listed
    .filter(({ token }) => gt(liquidity?.[token] ?? 0, 0))
    .map((item) => {
      const { token } = item
      const terraswap = find(PriceKey.PAIR, token)
      const oracle = find(PriceKey.ORACLE, token)
      const premium = minus(div(terraswap, oracle), 1)
      const staked = find(balanceKey, token)

      const long = apr?.[token]?.long
      const short = apr?.[token]?.short

      return {
        ...item,
        staked,
        totalStaked: find(AssetInfoKey.LPTOTALSTAKED, token),
        apr: { long, short },
        recommended: long && short && gt(short, long) ? "short" : "long",
        terraswap: {
          price: terraswap,
          change: calcChange({
            today: terraswap,
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
    .filter(({ symbol, name }) =>
      [symbol, name].some((text) =>
        text.toLocaleLowerCase().includes(input.toLocaleLowerCase())
      )
    )
    .sort(Sorters[sorter].compare)
    .sort((a, b) => Number(b.symbol === MIR) - Number(a.symbol === MIR))

  return !data ? null : (
    <>
      <section className="desktop">
        <Search value={input} onChange={(e) => setInput(e.target.value)}>
          <select value={sorter} onChange={(e) => setSorter(e.target.value)}>
            {Object.entries(Sorters).map(([key, { label }]) => (
              <option value={key} key={key}>
                {label}
              </option>
            ))}
          </select>
        </Search>
      </section>

      <Table
        rows={({ token }) =>
          getSymbol(token) === MIR ? { background: "darker" } : {}
        }
        columns={[
          {
            key: "token",
            title: "Ticker",
            render: (token) => <AssetItem token={token} />,
            bold: true,
          },
          {
            key: "apr.long",
            title: "Long",
            render: (value, { recommended }) => (
              <>
                <Percent color={recommended === "long" ? "blue" : undefined}>
                  {value}
                </Percent>
                <p className={styles.link}>
                  Long Farm
                  <Icon
                    name="ChevronRight"
                    size={8}
                    className={styles.chevron}
                  />
                </p>
              </>
            ),
            cell: (_, { token, recommended }) => ({
              background: recommended === "long" ? "darker" : undefined,
              to: { hash: FarmType.LONG, state: { token } },
            }),
            align: "right",
          },
          {
            key: "apr.short",
            title: "Short",
            render: (value, { token, recommended }) =>
              getSymbol(token) !== MIR && (
                <>
                  <Percent color={recommended === "short" ? "red" : undefined}>
                    {value}
                  </Percent>
                  <p className={styles.link}>
                    Short Farm
                    <Icon
                      name="ChevronRight"
                      size={8}
                      className={styles.chevron}
                    />
                  </p>
                </>
              ),
            cell: (_, { token, recommended }) =>
              getSymbol(token) !== MIR
                ? {
                    background: recommended === "short" ? "darker" : undefined,
                    to: { hash: FarmType.SHORT, state: { token } },
                  }
                : {},
            align: "right",
          },
          {
            key: "premium",
            title: "Premium",
            render: (value) => <Percent>{value}</Percent>,
            align: "right",
            desktop: true,
          },
          {
            key: "liquidity",
            title: "Liquidity",
            render: (value) => <Formatted symbol={UUSD}>{value}</Formatted>,
            align: "right",
            width: "18%",
            desktop: true,
          },
        ]}
        dataSource={dataSource}
      />
    </>
  )
}

export default FarmList
