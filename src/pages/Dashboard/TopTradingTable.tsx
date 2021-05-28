import { UST } from "../../constants"
import { gt } from "../../libs/math"
import { useContractsAddress, useContract, useRefetch } from "../../hooks"
import { AssetInfoKey, PriceKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"
import Table from "../../components/Table"
import Formatted from "../../components/Formatted"
import AssetItem from "../../components/AssetItem"
import { MarketType } from "../../types/Types"
import { getPath, MenuKey } from "../../routes"
import styles from "./TopTradingTable.module.scss"

const TopTradingTable = () => {
  const infoKey = AssetInfoKey.LIQUIDITY
  const keys = [PriceKey.PAIR, PriceKey.ORACLE, infoKey]

  const { listed } = useContractsAddress()
  const { find } = useContract()
  const { volume } = useAssetStats()
  const { data } = useRefetch(keys)

  const dataSource = listed.sort((a, b) =>
    gt(volume?.[b.token] ?? "0", volume?.[a.token] ?? "0") ? 1 : -1
  )

  return !data ? null : (
    <Table
      columns={[
        {
          key: "token",
          render: (token) => {
            const to = {
              pathname: getPath(MenuKey.MARKET),
              hash: MarketType.BUY,
              state: { token },
            }

            return <AssetItem token={token} to={to} />
          },
          bold: true,
        },
        {
          key: "price",
          dataIndex: "token",
          render: (token) => (
            <Formatted className={styles.price} unit={UST}>
              {find(PriceKey.PAIR, token)}
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

export default TopTradingTable
