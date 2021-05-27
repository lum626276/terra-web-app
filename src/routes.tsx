import { Switch, Route, RouteProps, Redirect } from "react-router-dom"
import { Dictionary } from "ramda"

/* Menu */
import Dashboard from "./pages/Dashboard"
import My from "./pages/My/My"
import Market from "./pages/Market"
import Farm from "./pages/Farm"
import Gov from "./pages/Gov"

/* Auth */
import Auth from "./pages/Auth"

/* Txs */
import Trade from "./pages/Trade"
import Mint from "./pages/Mint"
import Pool from "./pages/Pool"
import Unstake from "./pages/Unstake"

import Send from "./pages/Send"
import Burn from "./pages/Burn"
import Claim from "./pages/Claim"
import Airdrop from "./pages/Airdrop"
import LimitOrder from "./pages/LimitOrder" // Cancel limit order

/* Informations */
import Caution from "./forms/Caution"
import Info from "./pages/Info"
import Data from "./tools/Data"
import Tool from "./tools/Tool"

export enum MenuKey {
  DASHBOARD = "Dashboard",
  MY = "My Page",
  MARKET = "Market",
  FARM = "Farm",
  GOV = "Govern",

  AUTH = "Auth",

  TRADE = "Trade",
  MINT = "Mint",
  POOL = "Pool",
  UNSTAKE = "Unstake",

  SEND = "Send",
  BURN = "Burn",
  CLAIM = "Claim",
  AIRDROP = "Airdrop",
  LIMIT = "Limit order",
}

export const gnb = [MenuKey.MARKET, MenuKey.FARM, MenuKey.GOV]

export const menu: Dictionary<RouteProps> = {
  [MenuKey.DASHBOARD]: { path: "/", exact: true, component: Dashboard },
  [MenuKey.MY]: { path: "/my", component: My },
  [MenuKey.MARKET]: { path: "/market", component: Market },
  [MenuKey.FARM]: { path: "/farm", component: Farm },
  [MenuKey.GOV]: { path: "/gov", component: Gov },

  [MenuKey.AUTH]: { path: "/auth", component: Auth },

  [MenuKey.TRADE]: { path: "/trade", component: Trade },
  [MenuKey.MINT]: { path: "/mint", component: Mint },
  [MenuKey.POOL]: { path: "/pool", component: Pool },
  [MenuKey.UNSTAKE]: { path: "/unstake", component: Unstake },

  [MenuKey.SEND]: { path: "/send", component: Send },
  [MenuKey.BURN]: { path: "/burn/:token", component: Burn },
  [MenuKey.CLAIM]: { path: "/claim", component: Claim },
  [MenuKey.AIRDROP]: { path: "/airdrop", component: Airdrop },
  [MenuKey.LIMIT]: { path: "/limit", component: LimitOrder },

  caution: { path: "/caution", component: Caution },
  info: { path: "/info", component: Info },
  data: { path: "/data", component: Data },
  tool: { path: "/tool", component: Tool },
}

export const getPath = (key: MenuKey) => menu[key].path as string

export default (routes: Dictionary<RouteProps> = menu, path: string = "") => (
  <Switch>
    {Object.entries(routes).map(([key, route]) => (
      <Route {...route} path={path + route.path} key={key} />
    ))}

    <Redirect to="/" />
  </Switch>
)
