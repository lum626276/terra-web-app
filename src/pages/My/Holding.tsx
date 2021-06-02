import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { UST, UUSD } from "../../constants"
import { formatAsset } from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import { Di } from "../../components/Dl"
import Change from "../../components/Change"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import { TradeType } from "../../types/Types"
import NoAssets from "./NoAssets"
import { MyHolding } from "./types"

const Holding = ({ loading, totalValue, dataSource }: MyHolding) => {
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
            <TooltipIcon content={Tooltip.My.Holding}>Holding</TooltipIcon>
          }
          description={description}
          loading={loading}
        />
      }
      columns={[
        {
          key: "symbol",
          title: "Ticker",
          render: (symbol, { status, name }) => [
            <>
              {status === "DELISTED" && <Delisted />}
              <h1>{symbol}</h1>
            </>,
            name,
          ],
          bold: true,
        },
        {
          key: "price",
          render: (value, { change }) => [
            <Formatted unit={UST}>{value}</Formatted>,
            <Change>{change}</Change>,
          ],
          align: "right",
          narrow: ["right"],
        },
        {
          key: "balance",
          title: (
            <TooltipIcon content={Tooltip.My.Balance}>Balance</TooltipIcon>
          ),
          render: (value, { symbol }) => (
            <Formatted symbol={symbol} noUnit>
              {value}
            </Formatted>
          ),
          align: "right",
        },
        {
          key: "value",
          title: <TooltipIcon content={Tooltip.My.Value}>Value</TooltipIcon>,
          render: (value) => <Formatted symbol={UUSD}>{value}</Formatted>,
          align: "right",
        },
        {
          key: "actions",
          dataIndex: "token",
          render: (token, { status }) => {
            const link =
              status === "LISTED"
                ? {
                    to: {
                      pathname: getPath(MenuKey.TRADE),
                      state: { token },
                      hash: TradeType.BUY,
                    },
                    children: MenuKey.TRADE,
                  }
                : {
                    to: `/burn/${token}`,
                    children: MenuKey.BURN,
                  }

            return <LinkButton {...link} size="sm" outline />
          },
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  ) : !loading ? (
    <NoAssets description={MESSAGE.MyPage.Empty.Holding} link={MenuKey.TRADE} />
  ) : null
}

export default Holding
