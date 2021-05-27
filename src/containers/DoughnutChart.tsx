import { ChartData, ChartOptions } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { number } from "../libs/math"
import styles from "./DoughnutChart.module.scss"

const $blue38 = "#4a5460"
const $blue62 = "#55779d"
const $blue100 = "#66adff"
const $gray24 = "#3d3d3d"

const colors = [$blue100, $blue62, $blue38, $gray24]

interface Props {
  list: { label: string; value: string }[]
  format: (value: string) => string
}

const DoughnutChart = ({ list, format }: Props) => {
  const data: ChartData = {
    labels: list.map(({ label }) => label),
    datasets: [
      {
        data: list.map(({ value }) => number(value)),
        borderWidth: 0,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        hoverOffset: 0,
      },
    ],
  }

  const options: ChartOptions<"doughnut"> = {
    cutout: "60%",
    animation: { animateRotate: false },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  }

  return (
    <div className={styles.wrapper}>
      <ul>
        {list.map(({ label, value }, index) => (
          <li className={styles.item} key={label}>
            <header className={styles.header}>
              <div
                className={styles.square}
                style={{ backgroundColor: colors[index] }}
              />
              <h1 className={styles.label}>{label}</h1>
            </header>

            <p className={styles.value}>{format(value)}</p>
          </li>
        ))}
      </ul>

      <section style={{ width: 200, height: 200 }}>
        <Doughnut type="doughnut" data={data} options={options} />
      </section>
    </div>
  )
}

export default DoughnutChart
