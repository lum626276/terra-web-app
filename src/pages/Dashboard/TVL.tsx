import { UUSD } from "../../constants"
import { number } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import RatioChart from "../../containers/RatioChart"
import styles from "./TVL.module.scss"

const TVL = ({ total, liquidity, collateral, stakedMir }: TVL) => {
  const list = [
    { label: "Collateral", value: number(collateral) },
    { label: "Staked MIR", value: number(stakedMir) },
    { label: "Liquidity", value: number(liquidity) },
  ].sort(({ value: a }, { value: b }) => b - a)

  return (
    <Card title="Total Value Locked" lg>
      <Formatted symbol={UUSD} config={{ integer: true }} big>
        {total}
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
