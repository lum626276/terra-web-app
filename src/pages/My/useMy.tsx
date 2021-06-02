import { uniq } from "ramda"
import { minus, sum } from "../../libs/math"
import { useRefetch } from "../../hooks"
import { AccountInfoKey } from "../../hooks/contractKeys"
import { DataKey, useContract } from "../../hooks/useContract"
import useMyHolding from "./useMyHolding"
import useMyBorrowing from "./useMyBorrowing"
import useMyFarming from "./useMyFarming"
import useMyGov from "./useMyGov"
import useMyLimitOrder from "./useMyLimitOrder"
import { My } from "./types"

const useMy = (): My => {
  const holding = useMyHolding()
  const borrowing = useMyBorrowing()
  const farming = useMyFarming()
  const gov = useMyGov()
  const limitOrder = useMyLimitOrder()

  const keys = uniq(
    [holding, borrowing, farming, gov, limitOrder].reduce<DataKey[]>(
      (acc, { keys }) => [...acc, ...keys],
      []
    )
  )

  const { data } = useRefetch([...keys, AccountInfoKey.UUSD])

  /* total */
  const { uusd } = useContract()
  const values = {
    uusd,
    holding: holding.totalValue,
    borrowing: borrowing.totalMintedValue,
    collateral: borrowing.totalCollateralValue,
    withdrawble: farming.totalWithdrawableValue,
    reward: farming.totalRewardsValue,
    govStaked: gov.stakedValue,
    limitOrder: limitOrder.total,
  }

  const loading = !data
  const total = { value: calcTotalValue(values), loading }

  return { holding, borrowing, farming, gov, limitOrder, total, loading }
}

export default useMy

/* calc */
interface Values {
  uusd: string
  holding: string
  borrowing: string
  collateral: string
  withdrawble: string
  reward: string
  govStaked: string
  limitOrder: string
}

export const calcTotalValue = (values: Values) => {
  const { holding, borrowing, collateral, withdrawble, reward } = values
  const { limitOrder, uusd, govStaked } = values

  return minus(
    sum([
      holding,
      collateral,
      withdrawble,
      reward,
      govStaked,
      limitOrder,
      uusd,
    ]),
    borrowing
  )
}
