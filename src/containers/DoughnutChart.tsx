import { ChartData, ChartOptions } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { number } from "../libs/math"
import Legend, { colors } from "./Legend"
import styles from "./DoughnutChart.module.scss"

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

  const props = { data, options }

  return (
    <div className={styles.wrapper}>
      <ul>
        {list.map(({ label, value }, index) => (
          <li className={styles.item} key={label}>
            <Legend label={label} index={index}>
              {format(value)}
            </Legend>
          </li>
        ))}
      </ul>

      <section className={styles.chart}>
        <Doughnut {...props} type="doughnut" />
      </section>
    </div>
  )
}

export default DoughnutChart
