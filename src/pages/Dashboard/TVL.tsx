import { UUSD } from "../../constants"
import { formatAsset } from "../../libs/parse"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import RatioChart from "../../containers/RatioChart"
import styles from "./TVL.module.scss"

const TVL = ({ value }: { value: string }) => {
  const list = [
    { label: "Collateral", value: 3 * 1e6 * 1e6 },
    { label: "Staked MIR", value: 2 * 1e6 * 1e6 },
    { label: "Liquidity", value: 1 * 1e6 * 1e6 },
    { label: "ETC", value: 4 * 1e6 * 1e6 },
  ]

  return (
    <Card title="Total Value Locked" lg>
      <Formatted symbol={UUSD} config={{ integer: true }} big>
        {value}
      </Formatted>

      <section className={styles.chart}>
        <RatioChart
          list={list}
          format={(value) => formatAsset(String(value), UUSD)}
        />
      </section>
    </Card>
  )
}

export default TVL
