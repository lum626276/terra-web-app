import { UST, UUSD } from "../../constants"
import { formatAsset } from "../../libs/parse"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import DoughnutChart from "../../containers/DoughnutChart"

const MIRSupply = () => {
  const list = [
    { label: "Staked", value: String(3 * 1e6 * 1e6) },
    { label: "Community", value: String(2 * 1e6 * 1e6) },
    { label: "Liquidity", value: String(1 * 1e6 * 1e6) },
    { label: "ETC", value: String(4 * 1e6 * 1e6) },
  ]

  return (
    <Card title="MIR Supply" lg>
      <Formatted unit={UST} big>
        123456789
      </Formatted>

      <DoughnutChart
        list={list}
        format={(value) => formatAsset(String(value), UUSD)}
      />
    </Card>
  )
}

export default MIRSupply
