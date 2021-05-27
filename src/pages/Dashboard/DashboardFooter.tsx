import { UUSD } from "../../constants"
import { useRefetch } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import { StatsNetwork } from "../../statistics/useDashboard"
import Formatted from "../../components/Formatted"
import Card, { CardMain } from "../../components/Card"
import TopTrading from "./TopTrading"
import styles from "./DashboardFooter.module.scss"

interface Props extends Dashboard {
  network: StatsNetwork
}

const DashboardFooter = ({ network, ...props }: Props) => {
  const { latest24h, assetMarketCap } = props
  useRefetch([PriceKey.PAIR])

  return (
    <Card className={styles.card} full lg>
      <CardMain>
        <h1 className={styles.title}>mAsset</h1>

        <section className={styles.section}>
          <h1 className={styles.title}>Market Cap</h1>
          <Formatted symbol={UUSD} config={{ integer: true }} big>
            {assetMarketCap}
          </Formatted>
        </section>

        <section className={styles.section}>
          <h1 className={styles.title}>Fee</h1>
          <Formatted symbol={UUSD} config={{ integer: true }} big>
            {latest24h.feeVolume}
          </Formatted>
        </section>

        <section className={styles.section}>
          <h1 className={styles.title}>Transactions</h1>
          <Formatted config={{ integer: true }} big>
            {latest24h.transactions}
          </Formatted>
        </section>
      </CardMain>

      <section className={styles.table}>
        <TopTrading />
      </section>
    </Card>
  )
}

export default DashboardFooter
