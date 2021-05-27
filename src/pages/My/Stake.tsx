import classNames from "classnames"

import { LP, MIR, UST, UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { gt } from "../../libs/math"
import { format, formatAsset } from "../../libs/parse"
import { percent } from "../../libs/num"
import getLpName from "../../libs/getLpName"
import { getPath, MenuKey } from "../../routes"

import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Dl from "../../components/Dl"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"
import { MenuKey as StakeMenuKey, Type } from "../Stake"
import NoAssets from "./NoAssets"
import { MyStake } from "./types"

const Stake = ({ loading, dataSource, ...props }: MyStake) => {
  const { price, totalRewards, totalRewardsValue } = props

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <Dl
      list={[
        {
          title: "Total Reward",
          content: formatAsset(totalRewards, MIR),
        },
        {
          title: `${MIR} Price`,
          content: `${format(price)} ${UST}`,
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
          title: "Pool Name",
          render: (symbol, { status, gov }) => (
            <>
              {status === "DELISTED" && <Delisted />}
              {!gov ? getLpName(symbol) : `${symbol} (${MenuKey.GOV})`}
            </>
          ),
          bold: true,
        },
        {
          key: "apr",
          title: <TooltipIcon content={Tooltip.My.APR}>APR</TooltipIcon>,
          render: (value = "0") => percent(value),
          align: "right",
        },
        {
          key: "staked",
          title: <TooltipIcon content={Tooltip.My.Staked}>Staked</TooltipIcon>,
          render: (value, { gov }) => formatAsset(value, !gov ? LP : MIR),
          align: "right",
        },
        {
          key: "stakable",
          render: (value, { gov }) => (
            <span className={classNames({ red: !gov && gt(value, 0) })}>
              {formatAsset(value, !gov ? LP : MIR)}
            </span>
          ),
          align: "right",
        },
        {
          key: "reward",
          title: <TooltipIcon content={Tooltip.My.Reward}>Reward</TooltipIcon>,
          render: (value, { gov }) =>
            !gov ? (
              formatAsset(value, MIR)
            ) : (
              <TooltipIcon content={Tooltip.My.GovReward}>
                Automatically re-staked
              </TooltipIcon>
            ),
          align: "right",
        },
        {
          key: "actions",
          dataIndex: "token",
          render: (token, { status, gov }) => {
            const edit = !gov
              ? `${getPath(MenuKey.STAKE)}/${token}`
              : `${getPath(MenuKey.GOV)}/stake`

            const claim = !gov ? `${getPath(MenuKey.STAKE)}/${token}/claim` : ``

            const stakeItem = {
              to: { pathname: edit, hash: Type.STAKE },
              children: Type.STAKE,
            }

            const defaultList = [
              {
                to: { pathname: edit, hash: Type.UNSTAKE },
                children: Type.UNSTAKE,
              },
              {
                to: claim,
                children: StakeMenuKey.CLAIMSYMBOL,
              },
            ]

            const list =
              status === "LISTED" ? [stakeItem, ...defaultList] : defaultList

            return <DashboardActions list={list} />
          },
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  ) : !loading ? (
    <NoAssets description={MESSAGE.MyPage.Empty.Staked} link={MenuKey.STAKE} />
  ) : null
}

export default Stake
