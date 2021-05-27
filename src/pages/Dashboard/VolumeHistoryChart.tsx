import { UUSD } from "../../constants"
import Card, { CardMain } from "../../components/Card"
import Formatted from "../../components/Formatted"
import ChartContainer from "../../containers/ChartContainer"
import { toDatasets } from "../Dashboard"

const VolumeHistoryChart = ({ latest24h, tradingVolumeHistory }: Dashboard) => {
  const chart = (
    <ChartContainer
      datasets={
        tradingVolumeHistory ? toDatasets(tradingVolumeHistory, UUSD) : []
      }
      bar
    />
  )

  return (
    <Card title="Volume" full lg footer={chart}>
      <CardMain>
        <Formatted symbol={UUSD} config={{ integer: true }} big>
          {latest24h.volume}
        </Formatted>
      </CardMain>
    </Card>
  )
}

export default VolumeHistoryChart
