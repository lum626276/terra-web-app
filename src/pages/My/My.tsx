import { useEffect, useMemo, useState } from "react"
import { useWallet } from "@terra-money/wallet-provider"
import { gt } from "../../libs/math"
import { MenuKey } from "../../routes"
import { useAddress, useContract, useRefetch } from "../../hooks"
import { AccountInfoKey } from "../../hooks/contractKeys"
import useTxs from "../../statistics/useTxs"

import Page from "../../components/Page"
import Tab from "../../components/Tab"
import Grid from "../../components/Grid"
import Button from "../../components/Button"
import BuyLinks from "../../components/BuyLinks"
import ConnectionRequired from "../../containers/ConnectionRequired"

import useMy from "./useMy"
import TotalValue from "./TotalValue"
import Holdings from "./Holdings"
import Mint from "./Mint"
import Stake from "./Stake"
import Orders from "./Orders"
import Gov from "./Gov"
import HistoryList from "./HistoryList"

enum Tabs {
  HOLDINGS = "Holdings",
  ORDERS = "Limit Orders",
  BORROW = "Borrow",
  FARMING = "Farming",
  GOVERN = "Govern",
  HISTORY = "History",
}

const My = () => {
  const address = useAddress()
  const { disconnect } = useWallet()
  const my = useMy()
  const { loading, holdings, mint, stake, gov, orders } = my
  const shouldBuyUST = useShouldBuyUST()
  const txs = useTxs()

  const holdingsLength = holdings.dataSource.length
  const ordersLength = orders.dataSource.length
  const mintLength = mint.dataSource.length
  const stakeLength = stake.dataSource.length
  const govLength = gov.dataSource.length
  const govStakedValue = gov.stakedValue
  const txsLength = txs.data.length

  const tabs = useMemo(
    () =>
      [
        { label: Tabs.HOLDINGS, hidden: !holdingsLength },
        { label: Tabs.ORDERS, hidden: !ordersLength },
        { label: Tabs.BORROW, hidden: !mintLength },
        { label: Tabs.FARMING, hidden: !stakeLength },
        { label: Tabs.GOVERN, hidden: !govLength && !gt(govStakedValue, 0) },
        { label: Tabs.HISTORY, hidden: !txsLength },
      ].filter(({ hidden }) => !hidden),
    [
      holdingsLength,
      ordersLength,
      mintLength,
      stakeLength,
      govLength,
      govStakedValue,
      txsLength,
    ]
  )

  const [tab, setTab] = useState<Tabs>()

  useEffect(() => {
    tabs.length && setTab(tabs[0].label)
  }, [loading, tabs])

  const contents = [
    { key: Tabs.HOLDINGS, component: <Holdings {...holdings} /> },
    { key: Tabs.ORDERS, component: <Orders {...orders} /> },
    { key: Tabs.BORROW, component: <Mint {...mint} /> },
    { key: Tabs.FARMING, component: <Stake {...stake} /> },
    { key: Tabs.GOVERN, component: <Gov {...gov} /> },
    { key: Tabs.HISTORY, component: <HistoryList {...txs} /> },
  ].filter(({ key }) => tab === key)

  return (
    <Page title={MenuKey.MY} doc="/user-guide/getting-started/sending-tokens">
      {!address ? (
        <ConnectionRequired />
      ) : (
        <>
          {shouldBuyUST && <BuyLinks type="terra" />}

          <TotalValue {...my} />

          <Grid>
            <Tab
              tabs={tabs.map(({ label }) => label)}
              current={tab}
              onClick={(tab) => setTab(tab as Tabs)}
            />
          </Grid>

          {contents.map(({ component, key }) => (
            <Grid key={key}>{component}</Grid>
          ))}

          {disconnect && (
            <Button onClick={disconnect} color="secondary" outline block submit>
              Disconnect
            </Button>
          )}
        </>
      )}
    </Page>
  )
}

export default My

const useShouldBuyUST = () => {
  const { uusd } = useContract()
  const { data } = useRefetch([AccountInfoKey.UUSD])
  return !!data && !gt(uusd, 0)
}
