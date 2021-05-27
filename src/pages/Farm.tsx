import useHash from "../libs/useHash"
import Page from "../components/Page"
import Tab from "../components/Tab"
import FarmList from "./FarmList"
import Pool from "./Pool"
import Mint from "./Mint"

export enum Type {
  LONG = "long",
  SHORT = "short",
}

const Farm = () => {
  const { hash } = useHash<Type>()

  const render = {
    [Type.LONG]: () => <Pool />,
    [Type.SHORT]: () => <Mint />,
  }

  return (
    <Page title="Farm">
      {!hash ? (
        <FarmList />
      ) : (
        <Tab tabs={[Type.LONG, Type.SHORT]} current={hash}>
          {render[hash]()}
        </Tab>
      )}
    </Page>
  )
}

export default Farm
