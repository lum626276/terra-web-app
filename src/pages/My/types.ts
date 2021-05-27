import { DataKey } from "../../hooks/useContract"

export interface My {
  holdings: MyHoldings
  mint: MyMint
  pool: MyPool
  stake: MyStake
  orders: MyOrders
  total: MyTotal
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

export interface MyPool {
  keys: DataKey[]
  loading: boolean
  totalWithdrawableValue: string
  dataSource: MyPoolRow[]
}

export interface MyPoolRow extends ListedItem {
  balance: string
  withdrawable: { value: string; text: string }
  share: string
}

export interface MyStake {
  keys: DataKey[]
  loading: boolean
  price: string
  govStakedValue: string
  totalRewards: string
  totalRewardsValue: string
  dataSource: MyStakeRow[]
}

export interface MyStakeRow extends ListedItem {
  apr?: string
  staked: string
  stakable: string
  reward?: string
  gov?: boolean
}

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
