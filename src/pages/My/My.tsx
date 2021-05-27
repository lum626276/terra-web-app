import { useWallet } from "@terra-money/wallet-provider"
import { gt } from "../../libs/math"
import { MenuKey } from "../../routes"
import { useAddress, useContract, useRefetch } from "../../hooks"
import { AccountInfoKey } from "../../hooks/contractKeys"

import Page from "../../components/Page"
import Grid from "../../components/Grid"
import Button from "../../components/Button"
import BuyLinks from "../../components/BuyLinks"
import ConnectionRequired from "../../containers/ConnectionRequired"
import useMy from "./useMy"
import TotalValue from "./TotalValue"
import Holdings from "./Holdings"
import Mint from "./Mint"
import Pool from "./Pool"
import Stake from "./Stake"
import Orders from "./Orders"
import HistoryList from "./HistoryList"

const My = () => {
  const address = useAddress()
  const { disconnect } = useWallet()
  const my = useMy()
  const { holdings, mint, pool, stake, orders } = my
  const shouldBuyUST = useShouldBuyUST()

  const contents = [
    {
      key: "holdings",
      dataSource: holdings.dataSource,
      component: <Holdings {...holdings} />,
    },
    {
      key: "mint",
      dataSource: mint.dataSource,
      component: <Mint {...mint} />,
    },
    {
      key: "pool",
      dataSource: pool.dataSource,
      component: <Pool {...pool} />,
    },
    {
      key: "stake",
      dataSource: stake.dataSource,
      component: <Stake {...stake} />,
    },
    {
      key: "orders",
      dataSource: orders.dataSource,
      component: <Orders {...orders} />,
    },
  ]

  return (
    <Page title={MenuKey.MY} doc="/user-guide/getting-started/sending-tokens">
      {!address ? (
        <ConnectionRequired />
      ) : (
        <>
          {shouldBuyUST && <BuyLinks type="terra" />}

          <TotalValue {...my} />

          {contents.map(({ component, key }) => (
            <Grid key={key}>{component}</Grid>
          ))}

          <Grid>
            <HistoryList />
          </Grid>

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
