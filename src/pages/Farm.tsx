import useHash from "../libs/useHash"
import Page from "../components/Page"
import Tab from "../components/Tab"
import FarmList from "./FarmList"
import Pool from "./Pool"
import Mint from "./Mint"
import { FarmType, PoolType } from "../types/Types"

const Farm = () => {
  const { hash } = useHash<FarmType>()

  const render = {
    [FarmType.LONG]: () => <Pool type={PoolType.PROVIDE} />,
    [FarmType.SHORT]: () => <Mint />,
  }

  return (
    <Page title="Farm">
      {!hash ? (
        <FarmList />
      ) : (
        <Tab tabs={[FarmType.LONG, FarmType.SHORT]} current={hash}>
          {render[hash]()}
        </Tab>
      )}
    </Page>
  )
}

export default Farm
