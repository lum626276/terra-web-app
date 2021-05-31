import { Dictionary } from "ramda"
import { MIR, UUSD } from "../constants"
import { plus, div, gt } from "../libs/math"
import { useContractsAddress } from "../hooks"
import { PriceKey, AssetInfoKey } from "../hooks/contractKeys"
import { BalanceKey, AccountInfoKey } from "../hooks/contractKeys"

export default () => {
  const { listedAll, getToken } = useContractsAddress()

  const price = {
    [PriceKey.PAIR]: (pairPool: Dictionary<PairPool>) =>
      dict(pairPool, calcPairPrice),
    [PriceKey.ORACLE]: (oraclePrice: Dictionary<Rate>) =>
      dict(oraclePrice, ({ rate }) => rate),
    [PriceKey.END]: (mintInfo: Dictionary<MintInfo>) =>
      dict(mintInfo, ({ end_price }) => end_price),
  }

  const contractInfo = {
    [AssetInfoKey.LIQUIDITY]: (pairPool: Dictionary<PairPool>) =>
      dict(pairPool, (pool) => parsePairPool(pool).asset),
    [AssetInfoKey.MINCOLLATERALRATIO]: (mintInfo: Dictionary<MintInfo>) =>
      dict(mintInfo, ({ min_collateral_ratio }) => min_collateral_ratio),
    [AssetInfoKey.LPTOTALSTAKED]: (stakingPool: Dictionary<StakingPool>) =>
      dict(stakingPool, ({ total_bond_amount }) => total_bond_amount),
    [AssetInfoKey.LPTOTALSUPPLY]: (lpTokenInfo: Dictionary<TotalSupply>) =>
      dict(lpTokenInfo, ({ total_supply }) => total_supply),
  }

  const balance = {
    [BalanceKey.TOKEN]: (tokenBalance: Dictionary<Balance>) =>
      dict(tokenBalance, ({ balance }) => balance),
    [BalanceKey.LPTOTAL]: (
      lpTokenBalance: Dictionary<Balance>,
      stakingReward: StakingReward
    ) => reduceLP(listedAll, { lpTokenBalance, stakingReward }),
    [BalanceKey.LPSTAKABLE]: (lpTokenBalance: Dictionary<Balance>) =>
      dict(lpTokenBalance, ({ balance }) => balance),
    [BalanceKey.LPSTAKED]: (stakingReward: StakingReward) =>
      reduceStakingReward(stakingReward, "bond_amount"),
    [BalanceKey.SLPSTAKED]: (stakingReward: StakingReward) =>
      reduceStakingReward(stakingReward, "bond_amount", true),
    [BalanceKey.MIRGOVSTAKED]: (govStake: Balance) => {
      const token = getToken(MIR)
      return { [token]: govStake.balance }
    },
    [BalanceKey.REWARD]: (stakingReward: StakingReward) =>
      reduceStakingReward(stakingReward, "pending_reward"),
    [BalanceKey.SLPREWARD]: (stakingReward: StakingReward) =>
      reduceStakingReward(stakingReward, "pending_reward", true),
  }

  const accountInfo = {
    [AccountInfoKey.UUSD]: (bankBalance: BankBalance) =>
      findBalance(UUSD, bankBalance),
  }

  return { price, contractInfo, balance, accountInfo }
}

/* utils */
export const dict = <Data, Item = string>(
  dictionary: Dictionary<Data>,
  selector: (data: Data, token?: string) => Item
) =>
  Object.entries(dictionary).reduce<Dict<Item>>(
    (acc, [token, data]) => ({ ...acc, [token]: selector(data, token) }),
    {}
  )

/* helpers */
const calcPairPrice = (param: PairPool) => {
  const { uusd, asset } = parsePairPool(param)
  return [uusd, asset].every((v) => v && gt(v, 0)) ? div(uusd, asset) : "0"
}

export const parsePairPool = ({ assets, total_share }: PairPool) => ({
  uusd: assets.find(({ info }) => "native_token" in info)?.amount ?? "0",
  asset: assets.find(({ info }) => "token" in info)?.amount ?? "0",
  total: total_share ?? "0",
})

interface LPParams {
  lpTokenBalance: Dictionary<Balance>
  stakingReward: StakingReward
}

const reduceLP = (
  listedAll: ListedItem[],
  { lpTokenBalance, stakingReward }: LPParams
) =>
  listedAll.reduce<Dictionary<string>>(
    (acc, { token }) => ({
      ...acc,
      [token]: plus(
        lpTokenBalance[token].balance,
        stakingReward.reward_infos.find(
          ({ asset_token }) => asset_token === token
        )?.bond_amount
      ),
    }),
    {}
  )

const reduceStakingReward = (
  { reward_infos }: StakingReward,
  key: "bond_amount" | "pending_reward",
  short = false
) =>
  reward_infos.reduce<Dictionary<string>>(
    (acc, { asset_token, is_short, ...rest }) =>
      Object.assign(
        {},
        acc,
        is_short === short && { [asset_token]: rest[key] }
      ),
    {}
  )

const findBalance = (denom: string, { BankBalancesAddress }: BankBalance) =>
  BankBalancesAddress?.Result.find(({ Denom }) => Denom === denom)?.Amount ??
  "0"
