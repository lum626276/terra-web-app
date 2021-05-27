import { MIR } from "../../constants"
import { gt, sum, times } from "../../libs/math"
import { useContractsAddress, useContract, useCombineKeys } from "../../hooks"
import { BalanceKey, PriceKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"
import usePool from "../../forms/usePool"
import { MyStake } from "./types"

const useMyStake = (): MyStake => {
  const priceKey = PriceKey.PAIR
  const keys = [priceKey, BalanceKey.LPSTAKED, BalanceKey.REWARD]

  const { loading, data } = useCombineKeys(keys)
  const { listedAll, getToken } = useContractsAddress()
  const { find, rewards } = useContract()
  const { apr } = useAssetStats()
  const getPool = usePool()
  const mir = getToken(MIR)

  const long = listedAll
    .map((item: ListedItem) => {
      const { token } = item
      const balance = find(BalanceKey.LPSTAKED, token)
      const { fromLP } = getPool({ amount: balance, token })

      return {
        ...item,
        type: "long" as const,
        apr: apr?.[token]?.long,
        staked: find(BalanceKey.LPSTAKED, token),
        reward: find(BalanceKey.REWARD, token),
        withdrawable: fromLP,
      }
    })
    .filter(({ staked, reward }) =>
      [staked, reward].some((balance) => balance && gt(balance, 0))
    )

  const short = listedAll
    .map((item: ListedItem) => {
      const { token } = item
      const balance = find(BalanceKey.SLPSTAKED, token)
      const { fromLP } = getPool({ amount: balance, token })

      return {
        ...item,
        type: "short" as const,
        apr: apr?.[token]?.short,
        staked: find(BalanceKey.SLPSTAKED, token),
        reward: find(BalanceKey.REWARD, token),
        withdrawable: fromLP,
      }
    })
    .filter(({ staked, reward }) =>
      [staked, reward].some((balance) => balance && gt(balance, 0))
    )

  const dataSource = !data ? [] : [...long, ...short]

  const price = find(priceKey, mir)
  const totalRewards = rewards
  const totalRewardsValue = times(rewards, price)
  const totalWithdrawableValue = sum(
    dataSource.map(({ withdrawable }) => withdrawable.value)
  )

  const govStakedValue = times(find(BalanceKey.MIRGOVSTAKED, mir), price)

  return {
    keys,
    loading,
    dataSource,
    price,
    totalRewards,
    totalRewardsValue,
    totalWithdrawableValue,
    govStakedValue,
  }
}

export default useMyStake
