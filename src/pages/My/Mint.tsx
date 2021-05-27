import { ReactNode } from "react"
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
import Change from "../../components/Change"
import Tooltip, { TooltipIcon } from "../../components/Tooltip"
import Delisted from "../../components/Delisted"
import DashboardActions from "../../components/DashboardActions"
import { MintType } from "../../types/Types"
import NoAssets from "./NoAssets"
import { MyMint } from "./types"
import styles from "./Mint.module.scss"

const Mint = ({ loading, dataSource, ...props }: MyMint) => {
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
              key: "asset.symbol",
              title: "Ticker",
              render: (symbol, { idx, warning, danger, status }) => {
                const shouldWarn = warning || danger
                const className = classNames(styles.idx, { red: shouldWarn })
                const tooltip = warning
                  ? Tooltips.My.PositionWarning
                  : Tooltips.My.PositionDanger

                return [
                  status === "DELISTED" && <Delisted />,
                  <span className={className}>
                    {shouldWarn && (
                      <Tooltip content={tooltip}>
                        <MaterialIcon name="warning" size={16} />
                      </Tooltip>
                    )}
                    {lookupSymbol(symbol)}
                  </span>,
                  idx,
                ]
              },
              bold: true,
            },
            {
              key: "balance",
              title: renderList([
                <TooltipIcon content={Tooltips.My.MintedBalance}>
                  Minted Balance
                </TooltipIcon>,
                <TooltipIcon content={Tooltips.My.CollateralBalance}>
                  Collateral Balance
                </TooltipIcon>,
              ]),
              render: (_, { asset, collateral }) =>
                renderList([
                  formatAsset(asset.amount, asset.symbol),
                  formatAsset(collateral.amount, collateral.symbol),
                ]),
              align: "right",
            },
            {
              key: "asset.price",
              title: "Oracle Price",
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
            },
            {
              key: "value",
              title: renderList([
                <TooltipIcon content={Tooltips.My.MintedValue}>
                  Minted Value
                </TooltipIcon>,
                <TooltipIcon content={Tooltips.My.CollateralValue}>
                  Collateral Value
                </TooltipIcon>,
              ]),
              render: (_, { asset, collateral }) =>
                renderList([
                  formatAsset(asset.value, UUSD),
                  formatAsset(collateral.value, UUSD),
                ]),
              align: "right",
              narrow: ["right"],
            },
            {
              key: "change",
              title: "",
              render: (_, { asset, collateral }) =>
                renderList([
                  <Change>{asset.change}</Change>,
                  <Change>{collateral.change}</Change>,
                ]),
              narrow: ["left"],
            },
            {
              key: "ratio",
              title: [
                <TooltipIcon content={Tooltips.My.CollateralRatio}>
                  Col. Ratio
                </TooltipIcon>,
                "Min.",
              ],
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
              render: (idx, { status }) => {
                const to = {
                  pathname: getPath(MenuKey.MINT),
                  search: `idx=${idx}`,
                }

                const depositItem = {
                  to: { ...to, hash: MintType.DEPOSIT },
                  children: MintType.DEPOSIT,
                }

                const withdrawItem = {
                  to: { ...to, hash: MintType.WITHDRAW },
                  children: MintType.WITHDRAW,
                }

                const closeItem = {
                  to: { ...to, hash: MintType.CLOSE },
                  children: `${MintType.CLOSE} position`,
                }

                const list =
                  status === "LISTED"
                    ? [depositItem, withdrawItem, closeItem]
                    : [withdrawItem, closeItem]

                return <DashboardActions list={list} />
              },
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

export default Mint

const renderList = (list: ReactNode[]) => (
  <ul>
    {list.map((item, index) => (
      <li className={styles.item} key={index}>
        {item}
      </li>
    ))}
  </ul>
)
