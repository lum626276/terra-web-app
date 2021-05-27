import { sort } from "ramda"
import { number } from "../libs/math"
import { lookup } from "../libs/parse"
import { MenuKey } from "../routes"
import useDashboard, { StatsNetwork } from "../statistics/useDashboard"
import Page from "../components/Page"
import Masonry from "../components/Masonry"
import MIRPrice from "./Dashboard/MIRPrice"
import MIRSupply from "./Dashboard/MIRSupply"
import TVL from "./Dashboard/TVL"
import LiquidityHistoryChart from "./Dashboard/LiquidityHistoryChart"
import VolumeHistoryChart from "./Dashboard/VolumeHistoryChart"
import DashboardFooter from "./Dashboard/DashboardFooter"
import styles from "./Dashboard.module.scss"

const Dashboard = () => {
  const { dashboard, network, setNetwork } = useDashboard(StatsNetwork.COMBINE)

  const select = (
    <select
      value={network}
      onChange={(e) => setNetwork(e.target.value as StatsNetwork)}
    >
      {Object.entries(StatsNetwork).map(([key, value]) => (
        <option value={value} key={key}>
          {value === StatsNetwork.COMBINE ? "Terra + ETH" : value}
        </option>
      ))}
    </select>
  )

  return (
    <Page
      title={MenuKey.DASHBOARD}
      select={select}
      doc={"/user-guide/getting-started"}
    >
      {dashboard && (
        <Masonry>
          {[
            [
              { flex: 3, component: <MIRPrice /> },
              { flex: 7, component: <MIRSupply /> },
              {
                flex: 6,
                component: <TVL value={dashboard.totalValueLocked} />,
              },
            ],
            [
              { component: <LiquidityHistoryChart {...dashboard} /> },
              { component: <VolumeHistoryChart {...dashboard} /> },
            ],
          ]}
        </Masonry>
      )}

      {dashboard && (
        <footer className={styles.footer}>
          <DashboardFooter network={network} {...dashboard} />
        </footer>
      )}
    </Page>
  )
}

export default Dashboard

/* helpers */
export const sortByTimestamp = (data: ChartItem[]) =>
  sort(({ timestamp: a }, { timestamp: b }) => a - b, data)

export const toDatasets = (data: ChartItem[], symbol?: string) =>
  data.map(({ timestamp, value }) => {
    return { x: timestamp, y: number(lookup(value, symbol, { integer: true })) }
  })
