import { UST, UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { formatAsset } from "../../libs/parse"
import { capitalize } from "../../libs/utils"
import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Dl from "../../components/Dl"
import Button from "../../components/Button"
import { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import NoAssets from "./NoAssets"
import { MyLimitOrder } from "./types"

const LimitOrder = ({ loading, dataSource, total, more }: MyLimitOrder) => {
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
              title={renderTooltip("Limit Order", Tooltip.My.LimitOrder)}
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
              render: (value) => <Formatted unit={UST}>{value}</Formatted>,
              align: "right",
            },
            {
              key: "limitPrice",
              title: renderTooltip("Limit Price", Tooltip.My.LimitPrice),
              render: (value) => <Formatted unit={UST}>{value}</Formatted>,
              align: "right",
            },
            {
              key: "asset",
              title: "Order Amount",
              render: (asset, { uusd }) => [
                <Formatted symbol={asset.symbol}>{asset.amount}</Formatted>,
                <Formatted symbol={uusd.symbol}>{uusd.amount}</Formatted>,
              ],
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "order_id",
              render: (id) => (
                <LinkButton
                  to={[getPath(MenuKey.LIMIT), id].join("/")}
                  size="xs"
                  outline
                >
                  Cancel
                </LinkButton>
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
            description={MESSAGE.MyPage.Empty.LimitOrder}
            link={MenuKey.TRADE}
          />
        )
      )}

      {more && (
        <Button onClick={more} block outline>
          More
        </Button>
      )}
    </>
  )
}

export default LimitOrder
