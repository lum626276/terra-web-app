import { MIR } from "../../constants"
import { gt, times } from "../../libs/math"
import { useContractsAddress, useContract, useCombineKeys } from "../../hooks"
import { BalanceKey, PriceKey } from "../../hooks/contractKeys"
import { MyGov } from "./types"

const useMyGov = (): MyGov => {
  const priceKey = PriceKey.PAIR
  const keys = [BalanceKey.GOVSTAKED]

  const { loading } = useCombineKeys(keys)
  const { getToken } = useContractsAddress()
  const { find, parsed } = useContract()
  const govStake: GovStaker = parsed[BalanceKey.GOVSTAKED]

  const mir = getToken(MIR)

  const price = find(priceKey, mir)
  const staked = find(BalanceKey.GOVSTAKED, mir)
  const valid = gt(staked, 1)
  const stakedValue = times(staked, price)

  return {
    keys,
    loading,
    staked: valid ? staked : "0",
    stakedValue: valid ? stakedValue : "0",
    votingTotal: govStake?.pending_voting_rewards ?? "0",
    dataSource:
      govStake?.withdrawable_polls.map(([id, reward]) => ({ id, reward })) ??
      [],
  }
}

export default useMyGov
