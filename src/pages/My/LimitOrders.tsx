import { UST, UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { format, formatAsset } from "../../libs/parse"
import { capitalize } from "../../libs/utils"
import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Dl from "../../components/Dl"
import Button from "../../components/Button"
import { TooltipIcon } from "../../components/Tooltip"
import DashboardActions from "../../components/DashboardActions"
import Delisted from "../../components/Delisted"
import NoAssets from "./NoAssets"
import { MyLimitOrders } from "./types"

const LimitOrders = ({ loading, dataSource, total, more }: MyLimitOrders) => {
  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>{value}</TooltipIcon>
  )

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <Dl
      list={[
        {
          title: renderTooltip(
            "Total Locked Value",
            Tooltip.My.TotalLockedValue
          ),
          content: formatAsset(total, UUSD),
        },
      ]}
    />
  )

  return (
    <>
      {dataExists ? (
        <Table
          caption={
            <Caption
              title={renderTooltip("Limit Orders", Tooltip.My.LimitOrders)}
              description={description}
              loading={loading}
            />
          }
          columns={[
            {
              key: "type",
              title: ["Order Type", "ID"],
              render: (value, { status, order_id }) => [
                <>
                  {status === "DELISTED" && <Delisted />}
                  <h1>{capitalize(value)}</h1>
                </>,
                order_id,
              ],
              align: "left",
            },
            {
              key: "terraswapPrice",
              title: "Terraswap Price",
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
            },
            {
              key: "limitPrice",
              title: renderTooltip("Limit Price", Tooltip.My.LimitPrice),
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
            },
            {
              key: "asset",
              title: "Order Amount",
              render: (asset, { uusd }) => [
                formatAsset(asset.amount, asset.symbol),
                formatAsset(uusd.amount, uusd.symbol),
              ],
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "order_id",
              render: (id) => (
                <DashboardActions
                  list={[
                    {
                      to: [getPath(MenuKey.LIMIT), id].join("/"),
                      children: "Cancel",
                    },
                  ]}
                />
              ),
              align: "right",
              fixed: "right",
            },
          ]}
          dataSource={dataSource}
        />
      ) : (
        !loading && (
          <NoAssets
            description={MESSAGE.MyPage.Empty.Orders}
            link={MenuKey.TRADE}
          />
        )
      )}

      {more && (
        <Button onClick={more} block outline submit>
          More
        </Button>
      )}
    </>
  )
}

export default LimitOrders
