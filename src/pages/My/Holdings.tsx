import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { UST, UUSD } from "../../constants"
import { format, formatAsset } from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import { Di } from "../../components/Dl"
import Change from "../../components/Change"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"
import { Type } from "../Trade"
import NoAssets from "./NoAssets"
import { MyHoldings } from "./types"

const Holdings = ({ loading, totalValue, dataSource }: MyHoldings) => {
  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>{formatAsset(value, UUSD)}</TooltipIcon>
  )

  const dataExists = !!dataSource.length

  const description = dataExists && (
    <Di
      title="Total Holding Value"
      content={renderTooltip(totalValue, Tooltip.My.TotalHoldingValue)}
    />
  )

  return dataExists ? (
    <Table
      caption={
        <Caption
          title={
            <TooltipIcon content={Tooltip.My.Holdings}>Holdings</TooltipIcon>
          }
          description={description}
          loading={loading}
        />
      }
      columns={[
        {
          key: "symbol",
          title: "Ticker",
          render: (symbol, { status, name }) => (
            <>
              {status === "DELISTED" && <Delisted />}
              <h1>{symbol}</h1>
              {name}
            </>
          ),
          bold: true,
        },
        {
          key: "value",
          title: <TooltipIcon content={Tooltip.My.Value}>Value</TooltipIcon>,
          render: (value) => formatAsset(value, UUSD),
          align: "right",
        },
        {
          key: "balance",
          title: (
            <TooltipIcon content={Tooltip.My.Balance}>Balance</TooltipIcon>
          ),
          render: (value, { symbol }) => format(value, symbol),
          align: "right",
        },
        {
          key: "price",
          render: (value) => `${format(value)} ${UST}`,
          align: "right",
          narrow: ["right"],
        },
        {
          key: "change",
          title: "",
          render: (change: string) => <Change>{change}</Change>,
          narrow: ["left"],
        },
        {
          key: "actions",
          dataIndex: "token",
          render: (token, { status }) => {
            const to = {
              pathname: getPath(MenuKey.TRADE),
              state: { token },
            }

            const list =
              status === "LISTED"
                ? [
                    { to: { ...to, hash: Type.BUY }, children: Type.BUY },
                    { to: { ...to, hash: Type.SELL }, children: Type.SELL },
                    {
                      to: { ...to, pathname: getPath(MenuKey.SEND) },
                      children: MenuKey.SEND,
                    },
                  ]
                : [{ to: `/burn/${token}`, children: MenuKey.BURN }]

            return <DashboardActions list={list} />
          },
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  ) : !loading ? (
    <NoAssets
      description={MESSAGE.MyPage.Empty.Holdings}
      link={MenuKey.TRADE}
    />
  ) : null
}

export default Holdings
