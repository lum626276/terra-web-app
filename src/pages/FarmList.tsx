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
import { TooltipIcon } from "../components/Tooltip"
import { Type } from "./Farm"
import styles from "./FarmList.module.scss"

const FarmList = () => {
  const infoKey = AssetInfoKey.LIQUIDITY
  const keys = [PriceKey.PAIR, PriceKey.ORACLE, infoKey]

  const { listed } = useContractsAddress()
  const { find } = useContract()
  const yesterday = useYesterday()
  const { volume, liquidity, apr } = useAssetStats()
  const { data } = useRefetch(keys)

  const dataSource = listed
    .filter(({ token }) => gt(liquidity?.[token] ?? 0, 0))
    .map((item) => {
      const { token } = item
      const pair = find(PriceKey.PAIR, token)
      const oracle = find(PriceKey.ORACLE, token)
      const premium = minus(div(pair, oracle), 1)

      return {
        ...item,
        apr: apr?.[token],
        pair: {
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
    .sort((a, b) => (lt(a.volume, b.volume) ? 1 : -1))

  return !data ? null : (
    <Table
      columns={[
        {
          key: "symbol",
          title: "Ticker",
          render: (symbol, { token, name }) => {
            return (
              <div className={styles.asset}>
                <AssetIcon symbol={symbol} />
                <section className={styles.title}>
                  <h1 className={styles.symbol}>{symbol}</h1>
                  <p className={styles.name}>{name}</p>
                </section>
              </div>
            )
          },
          bold: true,
        },
        {
          key: "apr.long",
          title: "Long",
          render: (value, { token }) => (
            <Link to={{ hash: Type.LONG, state: { token } }}>
              <Percent color={"blue"}>{value}</Percent>
              <p className="small">Long Farm</p>
            </Link>
          ),
          align: "right",
        },
        {
          key: "apr.short",
          title: "Short",
          render: (value, { token }) => (
            <Link to={{ hash: Type.LONG, state: { token } }}>
              <Percent color={"red"}>{value}</Percent>
              <p className="small">Short Farm</p>
            </Link>
          ),
          align: "right",
        },
        {
          key: "premium",
          dataIndex: "premium",
          title: "Spread",
          render: (value) => <Percent>{value}</Percent>,
          align: "right",
        },
        {
          key: "tolerance",
          dataIndex: "tolerance",
          title: "Tolerance",
          render: (value) => <Percent>0.0123</Percent>,
          align: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default FarmList
