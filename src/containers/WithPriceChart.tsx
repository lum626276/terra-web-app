import { FC } from "react"
import { useContractsAddress } from "../hooks"
import PriceChart from "./PriceChart"
import styles from "./WithPriceChart.module.scss"

const WithPriceChart: FC<{ token: string }> = ({ token, children }) => {
  const { getSymbol } = useContractsAddress()

  return (
    <div className={styles.flex}>
      <section className={styles.content}>{children}</section>
      <section className={styles.chart}>
        <PriceChart token={token} symbol={getSymbol(token)} />
      </section>
    </div>
  )
}

export default WithPriceChart
