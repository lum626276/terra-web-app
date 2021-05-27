import useHash from "../libs/useHash"
import Page from "../components/Page"
import Tab from "../components/Tab"
import MarketList from "./MarketList"
import Trade from "./Trade"
import Mint from "./Mint"

export enum Type {
  BUY = "buy",
  SELL = "sell",
  BORROW = "borrow",
}

const Market = () => {
  const { hash } = useHash<Type>()

  const render = {
    [Type.BUY]: () => <Trade />,
    [Type.SELL]: () => <Trade />,
    [Type.BORROW]: () => <Mint />,
  }

  return (
    <Page title="Market">
      {!hash ? (
        <MarketList />
      ) : (
        <Tab tabs={[Type.BUY, Type.SELL, Type.BORROW]} current={hash}>
          {render[hash]()}
        </Tab>
      )}
    </Page>
  )
}

export default Market
