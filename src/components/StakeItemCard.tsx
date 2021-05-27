import { FC, ReactNode } from "react"
import classNames from "classnames/bind"
import { insertIf } from "../libs/utils"
import { percent } from "../libs/num"
import getLpName from "../libs/getLpName"
import Card from "./Card"
import MaterialIcon from "./MaterialIcon"
import Count from "./Count"
import TokenPair from "./TokenPair"
import { DlFooter } from "./Dl"
import Delisted from "./Delisted"
import styles from "./StakeItemCard.module.scss"

const cx = classNames.bind(styles)

export interface Props extends ListedItem {
  staked: boolean
  stakable: boolean

  apr: string
  totalStaked: ReactNode
  price?: ReactNode

  to?: string
  action?: ReactNode
  emphasize?: boolean
}

const StakeItemCard: FC<Props> = ({ token, symbol, name, to, ...item }) => {
  const { status, staked, stakable } = item
  const { price, apr, totalStaked, action, emphasize, children } = item

  const badges = [
    ...insertIf(staked, { label: "Staked", color: "blue" }),
    ...insertIf(stakable, { label: "Stakable", color: "slate" }),
  ]

  const stats = [
    { title: "APR", content: <Count format={percent}>{apr}</Count> },
    { title: "Total Staked", content: totalStaked },
    { title: "Price", content: price },
  ].filter(({ content }) => content)

  return (
    <Card to={to} badges={badges} className={cx({ emphasize })} key={token}>
      {action && <aside className={styles.action}>{action}</aside>}

      <article className={styles.component}>
        {status === "DELISTED" && <Delisted />}

        <div className={styles.main}>
          <TokenPair symbol={symbol} />

          <header className={cx(styles.header, { to })}>
            <h1 className={styles.heading}>{getLpName(symbol)}</h1>
            {to && <MaterialIcon name="chevron_right" size={20} />}
          </header>

          {price ? (
            <section className={styles.vertical}>
              {stats.map(({ title, content }, index) => (
                <article className={styles.item} key={index}>
                  <h1 className={styles.title}>{title}</h1>
                  <div className={styles.content}>{content}</div>
                </article>
              ))}
            </section>
          ) : (
            <DlFooter
              list={stats}
              className={styles.stats}
              ddClassName={styles.dd}
            />
          )}
        </div>

        {children}
      </article>
    </Card>
  )
}

export default StakeItemCard
