import { useWallet } from "@terra-money/wallet-provider"
import { gt } from "../../libs/math"
import useLocalStorage from "../../libs/useLocalStorage"
import { useContract, useRefetch } from "../../hooks"
import { AccountInfoKey } from "../../hooks/contractKeys"
import useTxs from "../../statistics/useTxs"

import Tab from "../../components/Tab"
import Grid from "../../components/Grid"
import Button from "../../components/Button"
import BuyLinks from "../../components/BuyLinks"

import useMy from "./useMy"
import TotalValue from "./TotalValue"
import Holding from "./Holding"
import Borrowing from "./Borrowing"
import Farm from "./Farm"
import LimitOrder from "./LimitOrder"
import Gov from "./Gov"
import HistoryList from "./HistoryList"

enum Tabs {
  ALL = "All",
  HOLDING = "Holding",
  LIMITORDER = "Limit Order",
  BORROW = "Borrow",
  FARMING = "Farming",
  GOVERN = "Govern",
  HISTORY = "History",
}

const MyConnected = () => {
  const { disconnect } = useWallet()
  const my = useMy()
  const { holding, borrowing, farm, gov, limitOrder } = my
  const shouldBuyUST = useShouldBuyUST()
  const txs = useTxs()

  /* state */
  const [{ tab }, setTab] = useLocalStorage<{ tab: Tabs }>("myPage", {
    tab: Tabs.ALL,
  })

  /* conditions */
  const hasHolding = !!holding.dataSource.length
  const hasLimitOrder = !!limitOrder.dataSource.length
  const hasBorrowing = !!borrowing.dataSource.length
  const hasFarm = !!farm.dataSource.length
  const hasGov = !!gov.dataSource.length || gt(gov.staked, 0)
  const hasTxs = !!txs.data.length

  const tabs = [
    {
      label: Tabs.HOLDING,
      hidden: !hasHolding,
      component: <Holding {...holding} />,
    },
    {
      label: Tabs.LIMITORDER,
      hidden: !hasLimitOrder,
      component: <LimitOrder {...limitOrder} />,
    },
    {
      label: Tabs.BORROW,
      hidden: !hasBorrowing,
      component: <Borrowing {...borrowing} />,
    },
    {
      label: Tabs.FARMING,
      hidden: !hasFarm,
      component: <Farm {...farm} />,
    },
    {
      label: Tabs.GOVERN,
      hidden: !hasGov,
      component: <Gov {...gov} />,
    },
    {
      label: Tabs.HISTORY,
      hidden: !hasTxs,
      component: <HistoryList {...txs} />,
    },
  ].filter(({ hidden }) => !hidden)

  const contents = tabs.filter(({ label }) => tab === Tabs.ALL || tab === label)

  return (
    <>
      {shouldBuyUST && <BuyLinks type="terra" />}

      <TotalValue {...my} />

      {!!tabs.length && (
        <>
          <Grid>
            <Tab
              tabs={[Tabs.ALL, ...tabs.map(({ label }) => label)]}
              current={tab}
              onClick={(tab) => setTab({ tab: tab as Tabs })}
            />
          </Grid>

          {contents.map(({ component, label }) => (
            <Grid key={label}>{component}</Grid>
          ))}
        </>
      )}

      {disconnect && (
        <Button onClick={disconnect} color="secondary" outline block submit>
          Disconnect
        </Button>
      )}
    </>
  )
}

export default MyConnected

const useShouldBuyUST = () => {
  const { uusd } = useContract()
  const { data } = useRefetch([AccountInfoKey.UUSD])
  return !!data && !gt(uusd, 0)
}
