import routes from "../routes"
import { SettingsProvider, useSettingsState } from "../hooks/useSettings"
import { ContractProvider, useContractState } from "../hooks/useContract"
import useConnectGraph from "../hooks/useConnectGraph"
import useAddress from "../hooks/useAddress"
import { StatsProvider, useStatsState } from "../statistics/useStats"
import Menu from "../components/Menu"
import { MenuKey, getPath, gnb } from "../routes"
import DelistAlert from "./DelistAlert"
import Airdrop from "./Airdrop"
import Layout from "./Layout"
import Nav from "./Nav"
import Header from "./Header"
import Footer from "./Footer"
import "./App.scss"

const icons: Dictionary<IconNames> = {
  [MenuKey.MARKET]: "Market",
  [MenuKey.FARM]: "Farm",
  [MenuKey.GOV]: "Governance",
}

const App = () => {
  const address = useAddress()
  const settings = useSettingsState()
  const contract = useContractState(address)
  const stats = useStatsState()
  useConnectGraph(address)

  const menu = Object.values(gnb).map((key: MenuKey) => ({
    icon: icons[key],
    attrs: { to: getPath(key), children: key },
  }))

  return (
    <SettingsProvider value={settings}>
      <ContractProvider value={contract}>
        <StatsProvider value={stats}>
          {address && <Airdrop />}
          {address && <DelistAlert />}

          <Layout
            nav={<Nav />}
            menu={<Menu list={menu} />}
            header={<Header />}
            footer={<Footer />}
          >
            {routes()}
          </Layout>
        </StatsProvider>
      </ContractProvider>
    </SettingsProvider>
  )
}

export default App
