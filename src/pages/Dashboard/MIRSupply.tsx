import { UST, UUSD } from "../../constants"
import { minus, number, sum } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import DoughnutChart from "../../containers/DoughnutChart"

const MIRSupply = ({ circulating, liquidity, staked }: MIRSupply) => {
  const list = [
    { label: "Staked", value: staked },
    { label: "Circulating", value: circulating },
    { label: "Liquidity", value: liquidity },
  ].sort(({ value: a }, { value: b }) => number(minus(b, a)))

  return (
    <Card title="MIR Supply" lg>
      <Formatted unit={UST} big>
        {sum([circulating, liquidity, staked])}
      </Formatted>

      <DoughnutChart
        list={list}
        format={(value) => formatAsset(String(value), UUSD, { integer: true })}
      />
    </Card>
  )
}

export default MIRSupply
