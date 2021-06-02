import { UST, UUSD } from "../../constants"
import { minus, plus, sum } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import DoughnutChart from "../../containers/DoughnutChart"

const MIRSupply = ({ circulating, liquidity, staked }: MIRSupply) => {
  const list = [
    { label: "Liquidity", value: liquidity },
    { label: "Staked", value: staked },
    { label: "ETC", value: minus(circulating, plus(liquidity, staked)) },
  ]

  return (
    <Card title="MIR Circulating Supply" lg>
      <Formatted unit={UST} big>
        {circulating}
      </Formatted>

      <DoughnutChart
        list={list}
        format={(value) => formatAsset(String(value), UUSD, { integer: true })}
      />
    </Card>
  )
}

export default MIRSupply
