import classNames from "classnames"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltips from "../../lang/Tooltip.json"
import { UST, UUSD } from "../../constants"
import { plus } from "../../libs/math"
import { formatAsset, lookupSymbol } from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"
import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Dl from "../../components/Dl"
import Icon from "../../components/Icon"
import Button from "../../components/Button"
import Tooltip, { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import LinkButton from "../../components/LinkButton"
import Formatted from "../../components/Formatted"
import { MintType } from "../../types/Types"
import CollateralRatio from "../../forms/CollateralRatio"
import NoAssets from "./NoAssets"
import ShortBadge from "./ShortBadge"
import { MyBorrowing } from "./types"
import styles from "./Borrowing.module.scss"

const Borrowing = ({ loading, dataSource, ...props }: MyBorrowing) => {
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
                <TooltipIcon content={Tooltips.My.Borrowing}>
                  Borrowing
                </TooltipIcon>
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
                      {is_short && <ShortBadge />}

                      {shouldWarn && (
                        <Tooltip content={tooltip}>
                          <Icon name="ExclamationCircleSolid" size={16} />
                        </Tooltip>
                      )}

                      {lookupSymbol(symbol)}
                    </span>
                  </>,

                  idx,
                ]
              },
              bold: true,
            },
            {
              key: "mintedAsset.price",
              title: "Oracle Price",
              render: (value) => <Formatted unit={UST}>{value}</Formatted>,
              align: "right",
            },
            {
              key: "borrowed",
              title: (
                <TooltipIcon content={Tooltips.My.MintedBalance}>
                  Borrowed
                </TooltipIcon>
              ),
              render: (_, { mintedAsset }) => [
                <Formatted symbol={mintedAsset.symbol}>
                  {mintedAsset.amount}
                </Formatted>,
                <Formatted symbol={UUSD}>{mintedAsset.value}</Formatted>,
              ],
              align: "right",
            },
            {
              key: "collateral",
              title: (
                <TooltipIcon content={Tooltips.My.CollateralBalance}>
                  Collateral
                </TooltipIcon>
              ),
              render: (_, { collateralAsset }) => {
                const amount = (
                  <Formatted symbol={collateralAsset.symbol}>
                    {collateralAsset.amount}
                  </Formatted>
                )

                const value = (
                  <Formatted symbol={UUSD}>{collateralAsset.value}</Formatted>
                )

                return collateralAsset.token === UUSD ? amount : [amount, value]
              },
              align: "right",
            },
            {
              key: "ratio",
              title: (
                <TooltipIcon content={Tooltips.My.CollateralRatio}>
                  Collateral Ratio
                </TooltipIcon>
              ),
              render: (value, { minRatio }) => (
                <CollateralRatio
                  min={minRatio}
                  safe={plus(minRatio, 0.5)}
                  ratio={value}
                  compact
                />
              ),
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
                  size="xs"
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
            description={MESSAGE.MyPage.Empty.Borrowing}
            link={MenuKey.MINT}
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

export default Borrowing
