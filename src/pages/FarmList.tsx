import { MIR } from "../constants"
import { lt, gt, div, minus } from "../libs/math"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { AssetInfoKey, PriceKey } from "../hooks/contractKeys"
import useAssetStats from "../statistics/useAssetStats"
import useYesterday, { calcChange } from "../statistics/useYesterday"
import Table from "../components/Table"
import Percent from "../components/Percent"
import AssetItem from "../components/AssetItem"
import { FarmType } from "../types/Types"

const FarmList = () => {
  const infoKey = AssetInfoKey.LIQUIDITY
  const keys = [PriceKey.PAIR, PriceKey.ORACLE, infoKey]

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

      return {
        ...item,
        apr: apr?.[token] ?? { long: undefined, short: undefined },
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
          render: (value) => (
            <>
              <Percent color={"blue"}>{value}</Percent>
              <p className="small">Long Farm</p>
            </>
          ),
          cell: (_, { token, apr }) => ({
            background:
              apr.long && apr.short && gt(apr.long, apr.short)
                ? "darker"
                : undefined,
            to: { hash: FarmType.LONG, state: { token } },
          }),
          align: "right",
        },
        {
          key: "apr.short",
          title: "Short",
          render: (value, { token }) =>
            getSymbol(token) !== MIR && (
              <>
                <Percent color={"red"}>{value}</Percent>
                <p className="small">Short Farm</p>
              </>
            ),
          cell: (_, { token, apr }) =>
            getSymbol(token) !== MIR
              ? {
                  background:
                    apr.long && apr.short && gt(apr.short, apr.long)
                      ? "darker"
                      : undefined,
                  to: { hash: FarmType.SHORT, state: { token } },
                }
              : {},
          align: "right",
        },
        {
          key: "premium",
          dataIndex: "premium",
          title: "Premium",
          render: (value) => <Percent>{value}</Percent>,
          align: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default FarmList
