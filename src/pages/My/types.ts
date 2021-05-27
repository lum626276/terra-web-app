import { DataKey } from "../../hooks/useContract"

export interface My {
  holdings: MyHoldings
  mint: MyMint
  stake: MyStake
  gov: MyGov
  orders: MyOrders
  total: MyTotal
  loading: boolean
}

export interface MyTotal {
  value: string
  loading: boolean
}

export interface MyHoldings {
  keys: DataKey[]
  loading: boolean
  totalValue: string
  dataSource: MyHoldingsRow[]
}

export interface MyHoldingsRow extends ListedItem {
  balance: string
  price: string
  value: string
  change?: string
}

export interface MyMint {
  keys: DataKey[]
  loading: boolean
  totalMintedValue: string
  totalCollateralValue: string
  dataSource: MyMintRow[]
  more?: () => void
}

export interface MyMintRow {
  idx: string
  status: ListedItemStatus
  collateral: MyMintAssetData
  asset: MyMintAssetData
  ratio?: string
  minRatio: string
  danger: boolean
  warning: boolean
}

export interface MyMintAssetData extends Asset {
  price: string
  value: string
  change?: string
  delisted: boolean
}

export interface MyStake {
  keys: DataKey[]
  loading: boolean
  price: string
  govStakedValue: string
  totalRewards: string
  totalRewardsValue: string
  totalWithdrawableValue: string
  dataSource: MyStakeRow[]
}

export type FarmType = "long" | "short"

export interface MyStakeRow extends ListedItem {
  type: FarmType
  apr?: string
  staked: string
  reward?: string
  gov?: boolean
}

export interface MyGov {
  keys: DataKey[]
  loading: boolean
  staked: string
  stakedValue: string
  dataSource: MyGovRow[]
}

export interface MyGovRow {}

export interface MyOrders {
  keys: DataKey[]
  loading: boolean
  total: string
  dataSource: MyOrdersRow[]
  more?: () => void
}

export interface MyOrdersRow extends Order {
  status: ListedItemStatus
  type: string
  token: string
  asset: Asset
  uusd: Asset
  limitPrice: string
  terraswapPrice: string
}
