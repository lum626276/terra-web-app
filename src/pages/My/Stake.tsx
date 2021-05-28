import { LP, MIR, SLP, UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import getLpName from "../../libs/getLpName"
import { getPath, MenuKey } from "../../routes"

import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Dl from "../../components/Dl"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"
import { StakeType } from "../../types/Types"
import NoAssets from "./NoAssets"
import { MyStake } from "./types"

const Stake = ({ loading, dataSource, ...props }: MyStake) => {
  const { totalRewards, totalRewardsValue } = props

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <Dl
      list={[
        {
          title: "Total Reward",
          content: formatAsset(totalRewards, MIR),
        },
        {
          title: "Total Reward Value",
          content: formatAsset(totalRewardsValue, UUSD),
        },
      ]}
    />
  )

  return dataExists ? (
    <Table
      caption={
        <Caption
          title={<TooltipIcon content={Tooltip.My.Stake}>Stake</TooltipIcon>}
          description={description}
          loading={loading}
        />
      }
      columns={[
        {
          key: "symbol",
          title: [
            "Pool Name",
            <TooltipIcon content={Tooltip.My.APR}>APR</TooltipIcon>,
          ],
          render: (symbol, { status, apr, type }) => [
            status === "DELISTED" && <Delisted />,
            getLpName(symbol, type),
            percent(apr),
          ],
          bold: true,
        },
        {
          key: "staked",
          title: <TooltipIcon content={Tooltip.My.Staked}>Staked</TooltipIcon>,
          render: (value, { type }) =>
            formatAsset(value, type === "long" ? LP : SLP),
          align: "right",
        },
        {
          key: "withdrawable",
          title: (
            <TooltipIcon content={Tooltip.My.Withdrawable}>
              Withdrawable Asset
            </TooltipIcon>
          ),
          render: ({ text, value }) => [text, formatAsset(value, UUSD)],
          align: "right",
        },
        {
          key: "reward",
          title: <TooltipIcon content={Tooltip.My.Reward}>Reward</TooltipIcon>,
          render: (value) => formatAsset(value, MIR),
          align: "right",
        },
        {
          key: "actions",
          dataIndex: "token",
          render: (token, { type }) => {
            const list = [
              {
                to: {
                  pathname: getPath(MenuKey.UNSTAKE),
                  hash: StakeType.UNSTAKE,
                  state: { token },
                },
                children: StakeType.UNSTAKE,
              },
            ]

            return type === "long" && <DashboardActions list={list} />
          },
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  ) : !loading ? (
    <NoAssets
      description={MESSAGE.MyPage.Empty.Staked}
      link={MenuKey.UNSTAKE}
    />
  ) : null
}

export default Stake
