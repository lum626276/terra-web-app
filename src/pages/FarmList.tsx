import classNames from "classnames/bind"
import { MIR } from "../constants"
import { lt, gt, div, minus } from "../libs/math"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { AssetInfoKey, BalanceKey, PriceKey } from "../hooks/contractKeys"
import useAssetStats from "../statistics/useAssetStats"
import useYesterday, { calcChange } from "../statistics/useYesterday"
import Table from "../components/Table"
import Percent from "../components/Percent"
import AssetItem from "../components/AssetItem"
import Icon from "../components/Icon"
import { FarmType } from "../types/Types"
import styles from "./FarmList.module.scss"

const cx = classNames.bind(styles)

const FarmList = () => {
  const balanceKey = BalanceKey.LPSTAKED
  const infoKey = AssetInfoKey.LIQUIDITY
  const keys = [PriceKey.PAIR, PriceKey.ORACLE, balanceKey, infoKey]

  const { listed, getSymbol } = useContractsAddress()
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
      const staked = find(balanceKey, token)

      const long = apr?.[token]?.long
      const short = apr?.[token]?.short

      return {
        ...item,
        staked,
        apr: { long, short },
        recommended: long && short && gt(short, long) ? "short" : "long",
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
    .sort((a, b) => Number(b.symbol === MIR) - Number(a.symbol === MIR))

  return !data ? null : (
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
                <Icon name="ChevronRight" size={8} className={styles.chevron} />
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
        },
        {
          key: "staked",
          title: "Staked",
          render: (value) => (
            <Icon
              name="Check"
              size={24}
              className={cx(styles.check, { checked: gt(value, 0) })}
            />
          ),
          align: "center",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default FarmList
