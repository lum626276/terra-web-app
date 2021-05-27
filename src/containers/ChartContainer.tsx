import { ChartData, ChartOptions, ScatterDataPoint } from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import "chartjs-adapter-date-fns"
import { format as formatDate } from "date-fns"
import { format } from "../libs/parse"

/* styles */
const $font = "'Gotham A', 'Gotham B'"
const $aqua = "#66adff"
const $gray34 = "#555557"
const $gray22 = "#373738"

interface Props {
  change?: string
  datasets: ScatterDataPoint[]
  fmt?: { t: string }
  compact?: boolean
  bar?: boolean
}

const ChartContainer = ({ change, datasets, ...props }: Props) => {
  const { fmt, compact, bar } = props

  const height = compact ? 120 : 240

  const data: ChartData = {
    datasets: [
      {
        fill: true,
        backgroundColor: $gray22,
        borderColor: $gray34,
        borderWidth: 2,
        tension: compact ? 0.2 : 0.05,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointHoverBorderWidth: 3,
        pointHoverBackgroundColor: $aqua,
        pointHoverBorderColor: $aqua,
        hoverBackgroundColor: $aqua,
        hoverBorderColor: $aqua,
        data: datasets,
      },
    ],
  }

  const options: ChartOptions<"bar" | "line"> = {
    interaction: { mode: "index", intersect: false },
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    layout: compact ? { padding: 20 } : { padding: { top: 40 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        displayColors: false,
        backgroundColor: "transparent",
        cornerRadius: 5,
        titleColor: $aqua,
        titleFont: { size: 16, weight: "500", family: $font },
        titleAlign: "center",
        bodyColor: $aqua,
        bodyFont: { size: 12, family: $font },
        bodyAlign: "center",
        xAlign: "center",
        yAlign: "bottom",
        callbacks: {
          title: ([{ parsed }]) => format(String(parsed.y)),
          label: ({ parsed }) =>
            fmt
              ? formatDate(new Date(parsed.x), fmt.t)
              : formatDate(new Date(parsed.x), "LLL dd, yyyy").toUpperCase(),
        },
      },
    },
    scales: {
      xAxes: {
        type: "time",
        display: false,
        ticks: {
          source: "auto",
          autoSkip: true,
          autoSkipPadding: 15,
          maxRotation: 0,
        },
        grid: { display: false },
      },

      yAxes: {
        display: false,
        position: "right",
        grid: {
          drawBorder: false,
        },
        ticks: {
          callback: (value) => format(value as string),
          padding: 20,
        },
      },
    },
  }

  const chartProps = { height, data, options }

  return (
    <article>
      {datasets.length > 1 && (
        <section>
          {bar ? (
            <Bar type="bar" {...chartProps} />
          ) : (
            <Line type="line" {...chartProps} />
          )}
        </section>
      )}
    </article>
  )
}

export default ChartContainer
