import { MIR, UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import getLpName from "../../libs/getLpName"
import { useContractsAddress } from "../../hooks"
import { getPath, MenuKey } from "../../routes"

import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Dl from "../../components/Dl"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import { StakeType } from "../../types/Types"
import NoAssets from "./NoAssets"
import { MyFarming } from "./types"

const Farming = ({ loading, dataSource, ...props }: MyFarming) => {
  const { getSymbol } = useContractsAddress()
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
          title={<TooltipIcon content={Tooltip.My.Stake}>Farming</TooltipIcon>}
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
            <>
              {status === "DELISTED" && <Delisted />}
              {getLpName(symbol, type)}
            </>,
            percent(apr),
          ],
          bold: true,
        },
        {
          key: "withdrawable",
          title: (
            <TooltipIcon content={Tooltip.My.Withdrawable}>
              Withdrawable Asset
            </TooltipIcon>
          ),
          render: (withdrawable) =>
            withdrawable && [
              <>
                <Formatted symbol={getSymbol(withdrawable.asset.token)}>
                  {withdrawable.asset.amount}
                </Formatted>{" "}
                +{" "}
                <Formatted symbol={UUSD}>{withdrawable.uusd.amount}</Formatted>
              </>,
              <Formatted symbol={UUSD}>{withdrawable.value}</Formatted>,
            ],
          align: "right",
        },
        {
          key: "reward",
          title: <TooltipIcon content={Tooltip.My.Reward}>Reward</TooltipIcon>,
          render: (value) => <Formatted symbol={MIR}>{value}</Formatted>,
          align: "right",
        },
        {
          key: "actions",
          dataIndex: "token",
          render: (token, { type }) =>
            type === "long" && (
              <LinkButton
                to={{
                  pathname: getPath(MenuKey.UNSTAKE),
                  hash: StakeType.UNSTAKE,
                  state: { token },
                }}
                size="xs"
                outline
              >
                {StakeType.UNSTAKE}
              </LinkButton>
            ),
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  ) : !loading ? (
    <NoAssets
      description={MESSAGE.MyPage.Empty.Farming}
      link={MenuKey.UNSTAKE}
    />
  ) : null
}

export default Farming
