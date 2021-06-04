import { DataKey } from "../../hooks/useContract"

export interface My {
  holding: MyHolding
  borrowing: MyBorrowing
  farming: MyFarming
  gov: MyGov
  limitOrder: MyLimitOrder
  total: MyTotal
  loading: boolean
}

export interface MyTotal {
  value: string
  loading: boolean
}

export interface MyHolding {
  keys: DataKey[]
  loading: boolean
  totalValue: string
  dataSource: MyHoldingRow[]
}

export interface MyHoldingRow extends ListedItem {
  balance: string
  price: string
  value: string
  change?: string
}

export interface MyBorrowing {
  keys: DataKey[]
  loading: boolean
  totalMintedValue: string
  totalCollateralValue: string
  dataSource: MyBorrowingRow[]
  more?: () => void
}

export interface MyBorrowingRow extends MintPosition {
  idx: string
  status: ListedItemStatus
  collateralAsset: MyBorrowingAssetData
  mintedAsset: MyBorrowingAssetData
  ratio?: string
  minRatio: string
  danger: boolean
  warning: boolean
}

export interface MyBorrowingAssetData extends Asset {
  price: string
  value: string
  change?: string
  delisted: boolean
}

export interface MyFarming {
  keys: DataKey[]
  loading: boolean
  price: string
  govStakedValue: string
  totalRewards: string
  totalRewardsValue: string
  totalWithdrawableValue: string
  dataSource: MyFarmingRow[]
}

export type FarmingType = "long" | "short"

export interface MyFarmingRow extends ListedItem {
  type: FarmingType
  apr?: string
  staked: string
  reward?: string
  is_short?: boolean
}

export interface MyGov {
  keys: DataKey[]
  loading: boolean
  staked: string
  stakedValue: string
  dataSource: MyGovRow[]
}

export interface MyGovRow {}

export interface MyLimitOrder {
  keys: DataKey[]
  loading: boolean
  total: string
  dataSource: MyLimitOrderRow[]
  more?: () => void
}

export interface MyLimitOrderRow extends Order {
  status: ListedItemStatus
  type: string
  token: string
  asset: Asset
  uusd: Asset
  limitPrice: string
  terraswapPrice: string
}
