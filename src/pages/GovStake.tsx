import useHash from "../libs/useHash"
import Page from "../components/Page"
import StakeForm from "../forms/StakeForm"
import { StakeType } from "../types/Types"

const GovStake = () => {
  const { hash: type } = useHash<StakeType>(StakeType.STAKE)
  const tab = { tabs: [StakeType.STAKE, StakeType.UNSTAKE], current: type }

  return (
    <Page>{type && <StakeForm type={type} tab={tab} key={type} gov />}</Page>
  )
}

export default GovStake
