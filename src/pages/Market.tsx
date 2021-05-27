import useHash from "../libs/useHash"
import Page from "../components/Page"
import Tab from "../components/Tab"
import MarketList from "./MarketList"
import Trade from "./Trade"
import Mint from "./Mint"
import { MarketType } from "../types/Types"

const Market = () => {
  const { hash } = useHash<MarketType>()

  const render = {
    [MarketType.BUY]: () => <Trade />,
    [MarketType.SELL]: () => <Trade />,
    [MarketType.BORROW]: () => <Mint />,
  }

  return (
    <Page title="Market">
      {!hash ? (
        <MarketList />
      ) : (
        <Tab
          tabs={[MarketType.BUY, MarketType.SELL, MarketType.BORROW]}
          current={hash}
        >
          {render[hash]()}
        </Tab>
      )}
    </Page>
  )
}

export default Market
