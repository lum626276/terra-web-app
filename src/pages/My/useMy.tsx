import { uniq } from "ramda"
import { minus, sum } from "../../libs/math"
import { useRefetch } from "../../hooks"
import { AccountInfoKey } from "../../hooks/contractKeys"
import { DataKey, useContract } from "../../hooks/useContract"
import useMyHoldings from "./useMyHoldings"
import useMyBorrowed from "./useMyBorrowed"
import useMyFarm from "./useMyFarm"
import useMyGov from "./useMyGov"
import useMyLimitOrders from "./useMyLimitOrders"
import { My } from "./types"

const useMy = (): My => {
  const holdings = useMyHoldings()
  const mint = useMyBorrowed()
  const stake = useMyFarm()
  const gov = useMyGov()
  const orders = useMyLimitOrders()

  const keys = uniq(
    [holdings, mint, stake, gov, orders].reduce<DataKey[]>(
      (acc, { keys }) => [...acc, ...keys],
      []
    )
  )

  const { data } = useRefetch([...keys, AccountInfoKey.UUSD])

  /* total */
  const { uusd } = useContract()
  const values = {
    uusd,
    holdings: holdings.totalValue,
    minted: mint.totalMintedValue,
    collateral: mint.totalCollateralValue,
    withdrawble: stake.totalWithdrawableValue,
    reward: stake.totalRewardsValue,
    govStaked: gov.stakedValue,
    orders: orders.total,
  }

  const loading = !data
  const total = { value: calcTotalValue(values), loading }

  return { holdings, mint, stake, gov, orders, total, loading }
}

export default useMy

/* calc */
interface Values {
  uusd: string
  holdings: string
  minted: string
  collateral: string
  withdrawble: string
  reward: string
  govStaked: string
  orders: string
}

export const calcTotalValue = (values: Values) => {
  const { holdings, minted, collateral, withdrawble, reward, orders } = values
  const { uusd, govStaked } = values

  return minus(
    sum([holdings, collateral, withdrawble, reward, govStaked, orders, uusd]),
    minted
  )
}
