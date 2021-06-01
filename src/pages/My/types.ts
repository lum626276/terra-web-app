import { DataKey } from "../../hooks/useContract"

export interface My {
  holdings: MyHoldings
  mint: MyBorrowed
  stake: MyFarm
  gov: MyGov
  orders: MyLimitOrders
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

export interface MyBorrowed {
  keys: DataKey[]
  loading: boolean
  totalMintedValue: string
  totalCollateralValue: string
  dataSource: MyBorrowedRow[]
  more?: () => void
}

export interface MyBorrowedRow extends MintPosition {
  idx: string
  status: ListedItemStatus
  collateralAsset: MyBorrowedAssetData
  mintedAsset: MyBorrowedAssetData
  ratio?: string
  minRatio: string
  danger: boolean
  warning: boolean
}

export interface MyBorrowedAssetData extends Asset {
  price: string
  value: string
  change?: string
  delisted: boolean
}

export interface MyFarm {
  keys: DataKey[]
  loading: boolean
  price: string
  govStakedValue: string
  totalRewards: string
  totalRewardsValue: string
  totalWithdrawableValue: string
  dataSource: MyFarmRow[]
}

export type FarmType = "long" | "short"

export interface MyFarmRow extends ListedItem {
  type: FarmType
  apr?: string
  staked: string
  reward?: string
}

export interface MyGov {
  keys: DataKey[]
  loading: boolean
  staked: string
  stakedValue: string
  dataSource: MyGovRow[]
}

export interface MyGovRow {}

export interface MyLimitOrders {
  keys: DataKey[]
  loading: boolean
  total: string
  dataSource: MyLimitOrdersRow[]
  more?: () => void
}

export interface MyLimitOrdersRow extends Order {
  status: ListedItemStatus
  type: string
  token: string
  asset: Asset
  uusd: Asset
  limitPrice: string
  terraswapPrice: string
}
