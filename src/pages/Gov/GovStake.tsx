import { MIR } from "../../constants"
import useHash from "../../libs/useHash"
import { useContractsAddress } from "../../hooks"
import Tab from "../../components/Tab"
import StakeForm from "../../forms/StakeForm"
import { StakeType } from "../../types/Types"

const GovStake = () => {
  const { getToken } = useContractsAddress()
  const token = getToken(MIR)
  const { hash: type } = useHash<StakeType>(StakeType.STAKE)

  return (
    <Tab tabs={[StakeType.STAKE, StakeType.UNSTAKE]} current={type}>
      <StakeForm type={type} token={token} key={type} gov />
    </Tab>
  )
}

export default GovStake
