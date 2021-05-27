import { Link } from "react-router-dom"
import { UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { lt, gt, div, minus } from "../../libs/math"
import { useContractsAddress, useContract, useRefetch } from "../../hooks"
import { AssetInfoKey, PriceKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"
import useYesterday, { calcChange } from "../../statistics/useYesterday"
import Table from "../../components/Table"
import AssetIcon from "../../components/AssetIcon"
import Formatted from "../../components/Formatted"
import { TooltipIcon } from "../../components/Tooltip"
import { getPath, MenuKey } from "../../routes"
import { Type } from "../Market"
import styles from "./TopTradingTable.module.scss"

const MarketList = () => {
  const infoKey = AssetInfoKey.LIQUIDITY
  const keys = [PriceKey.PAIR, PriceKey.ORACLE, infoKey]

  const { listed } = useContractsAddress()
  const { find } = useContract()
  const yesterday = useYesterday()
  const { volume, liquidity } = useAssetStats()
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
            const to = {
              pathname: getPath(MenuKey.MARKET),
              hash: Type.BUY,
              state: { token },
            }

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
      ]}
      dataSource={dataSource.slice(0, 4)}
      config={{ hideHeader: true, darker: true }}
    />
  )
}

export default MarketList
