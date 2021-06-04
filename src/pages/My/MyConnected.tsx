import { useWallet } from "@terra-money/wallet-provider"
import { gt } from "../../libs/math"
import useLocalStorage from "../../libs/useLocalStorage"
import useTxs from "../../statistics/useTxs"

import Tab from "../../components/Tab"
import Grid from "../../components/Grid"

import useMy from "./useMy"
import TotalValue from "./TotalValue"
import Holding from "./Holding"
import Borrowing from "./Borrowing"
import Farming from "./Farming"
import LimitOrder from "./LimitOrder"
import Gov from "./Gov"
import HistoryList from "./HistoryList"

import styles from "./MyConnected.module.scss"

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
  const { holding, borrowing, farming, gov, limitOrder, loading } = my

  const txs = useTxs()

  /* state */
  const [{ tab }, setTab] = useLocalStorage<{ tab: Tabs }>("myPage", {
    tab: Tabs.ALL,
  })

  /* conditions */
  const hasHolding = !!holding.dataSource.length
  const hasLimitOrder = !!limitOrder.dataSource.length
  const hasBorrowing = !!borrowing.dataSource.length
  const hasFarming = !!farming.dataSource.length
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
      hidden: !hasFarming,
      component: <Farming {...farming} />,
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

  return loading ? null : (
    <>
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
        <p className={styles.footer}>
          <button className={styles.disconnect} onClick={disconnect}>
            Disconnect
          </button>
        </p>
      )}
    </>
  )
}

export default MyConnected
