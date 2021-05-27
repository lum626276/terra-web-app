import { last } from "ramda"
import { UUSD } from "../../constants"
import Card, { CardMain } from "../../components/Card"
import Formatted from "../../components/Formatted"
import Change from "../../components/Change"
import ChartContainer from "../../containers/ChartContainer"
import { calcChange } from "../../statistics/useYesterday"
import { sortByTimestamp, toDatasets } from "../Dashboard"

const LiquidityHistoryChart = ({ liquidityHistory }: Dashboard) => {
  const change =
    liquidityHistory && liquidityHistory.length >= 2
      ? calcChange({
          yesterday: liquidityHistory[liquidityHistory.length - 2]?.value,
          today: liquidityHistory[liquidityHistory.length - 1]?.value,
        })
      : undefined

  const chart = (
    <ChartContainer
      datasets={liquidityHistory ? toDatasets(liquidityHistory, UUSD) : []}
    />
  )

  return (
    <Card title="Liquidity" full lg footer={chart}>
      <CardMain>
        <Formatted symbol={UUSD} config={{ integer: true }} big>
          {liquidityHistory
            ? last(sortByTimestamp(liquidityHistory))?.value
            : "0"}
        </Formatted>

        <Change>{change}</Change>
      </CardMain>
    </Card>
  )
}

export default LiquidityHistoryChart
