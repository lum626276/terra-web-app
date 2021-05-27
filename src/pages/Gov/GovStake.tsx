import { MIR } from "../../constants"
import useHash from "../../libs/useHash"
import { useContractsAddress } from "../../hooks"
import Tab from "../../components/Tab"
import StakeForm from "../../forms/StakeForm"
import { Type } from "../Stake"

const GovStake = () => {
  const { getToken } = useContractsAddress()
  const token = getToken(MIR)
  const { hash: type } = useHash<Type>(Type.STAKE)

  return (
    <Tab tabs={[Type.STAKE, Type.UNSTAKE]} current={type}>
      <StakeForm type={type} token={token} key={type} gov />
    </Tab>
  )
}

export default GovStake
