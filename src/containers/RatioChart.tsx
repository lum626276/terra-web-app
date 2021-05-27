import { div, sum } from "../libs/math"
import { percent } from "../libs/num"
import styles from "./RatioChart.module.scss"

const $blue38 = "#4a5460"
const $blue62 = "#55779d"
const $blue100 = "#66adff"
const $gray24 = "#3d3d3d"

const colors = [$blue100, $blue62, $blue38, $gray24]

interface Props {
  list: { label: string; value: number }[]
  format: (value: number) => string
}

const RatioChart = ({ list, format }: Props) => {
  const total = sum(list.map(({ value }) => value))

  return (
    <section className={styles.track}>
      {list.map(({ label, value }, index) => (
        <div
          className={styles.item}
          style={{ width: percent(div(value, total)) }}
          key={label}
        >
          <div
            className={styles.fill}
            style={{ backgroundColor: colors[index] }}
          />

          <div className={styles.text}>
            <h1 className={styles.label}>{label}</h1>
            <p className={styles.value}>{format(value)}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export default RatioChart
