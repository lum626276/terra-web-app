import classNames from "classnames"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltips from "../../lang/Tooltip.json"
import { UST, UUSD } from "../../constants"
import { format, formatAsset, lookupSymbol } from "../../libs/parse"
import { percent } from "../../libs/num"
import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Dl from "../../components/Dl"
import MaterialIcon from "../../components/MaterialIcon"
import Button from "../../components/Button"
import Tooltip, { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import { MintType } from "../../types/Types"
import NoAssets from "./NoAssets"
import { MyBorrowed } from "./types"
import styles from "./Borrowed.module.scss"

const Borrowed = ({ loading, dataSource, ...props }: MyBorrowed) => {
  const { totalMintedValue, totalCollateralValue, more } = props

  const renderTooltip = (value: string, tooltip: string) => (
    <TooltipIcon content={tooltip}>{formatAsset(value, UUSD)}</TooltipIcon>
  )

  const dataExists = !!dataSource.length
  const description = dataExists && (
    <Dl
      list={[
        {
          title: "Total Minted Value",
          content: renderTooltip(totalMintedValue, Tooltips.My.TotalAssetValue),
        },
        {
          title: "Total Collateral Value",
          content: renderTooltip(
            totalCollateralValue,
            Tooltips.My.TotalCollateralValue
          ),
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
              title={
                <TooltipIcon content={Tooltips.My.Mint}>Borrowed</TooltipIcon>
              }
              description={description}
              loading={loading}
            />
          }
          rows={({ warning, danger }) => ({
            background: warning || danger ? "red" : undefined,
          })}
          columns={[
            {
              key: "mintedAsset.symbol",
              title: ["Ticker", "ID"],
              render: (symbol, { idx, warning, danger, status, is_short }) => {
                const shouldWarn = warning || danger
                const className = classNames(styles.idx, { red: shouldWarn })
                const tooltip = warning
                  ? Tooltips.My.PositionWarning
                  : Tooltips.My.PositionDanger

                return [
                  <>
                    {status === "DELISTED" && <Delisted />}
                    <span className={className}>
                      {shouldWarn && (
                        <Tooltip content={tooltip}>
                          <MaterialIcon name="warning" size={16} />
                        </Tooltip>
                      )}
                      {lookupSymbol(symbol)}
                    </span>
                  </>,
                  <>
                    {idx}
                    {is_short && "short"}
                  </>,
                ]
              },
              bold: true,
            },
            {
              key: "mintedAsset.price",
              title: "Oracle Price",
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
            },
            {
              key: "borrowed",
              title: (
                <TooltipIcon content={Tooltips.My.MintedBalance}>
                  Borrowed Balance
                </TooltipIcon>
              ),
              render: (_, { mintedAsset }) => [
                formatAsset(mintedAsset.amount, mintedAsset.symbol),
                formatAsset(mintedAsset.value, UUSD),
              ],
              align: "right",
            },
            {
              key: "collateral",
              title: (
                <TooltipIcon content={Tooltips.My.CollateralBalance}>
                  Collateral Balance
                </TooltipIcon>
              ),
              render: (_, { collateralAsset }) => [
                formatAsset(collateralAsset.amount, collateralAsset.symbol),
                formatAsset(collateralAsset.value, UUSD),
              ],
              align: "right",
            },
            {
              key: "ratio",
              title: (
                <TooltipIcon content={Tooltips.My.CollateralRatio}>
                  Col Ratio
                </TooltipIcon>
              ),
              render: (value, { minRatio, warning, danger }) => {
                const content = [percent(value), percent(minRatio)]
                return warning || danger ? (
                  <strong className="red">{content}</strong>
                ) : (
                  content
                )
              },
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "idx",
              render: (idx) => (
                <LinkButton
                  to={{
                    pathname: getPath(MenuKey.MINT),
                    search: `idx=${idx}`,
                    hash: MintType.CLOSE,
                  }}
                  size="sm"
                  outline
                >
                  Manage
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
            description={MESSAGE.MyPage.Empty.Minted}
            link={MenuKey.MINT}
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

export default Borrowed
