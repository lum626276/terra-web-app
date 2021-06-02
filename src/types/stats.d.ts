interface Dashboard {
  assetMarketCap: string
  collateralRatio: string
  govAPR: string

  mirSupply: MIRSupply

  totalValueLocked: TVL

  latest24h: {
    transactions: string
    volume: string
    feeVolume: string
    mirVolume: string
  }

  liquidityHistory: ChartItem[]
  tradingVolumeHistory: ChartItem[]
}

interface MIRSupply {
  circulating: string
  liquidity: string
  staked: string
}

interface TVL {
  total: string
  liquidity: string
  collateral: string
  stakedMir: string
}

interface ChartItem {
  timestamp: number
  value: string
}

/* asset */
interface AssetStatsData {
  token: string
  description?: string

  prices: {
    history: PriceHistoryItem[]
  }

  statistic: {
    liquidity: string
    volume: string
    apr: APR
  }
}

interface PriceHistoryItem {
  timestamp: number
  price: string
}

interface APR {
  long: string
  short: string
}

interface AssetStats {
  description: Dict<string | undefined>
  liquidity: Dict<string | undefined>
  volume: Dict<string | undefined>
  apr: Dict<APR | undefined>
  history: Dict<PriceHistoryItem[]>
}

/* price */
interface YesterdayData {
  [token: string]: {
    prices: {
      priceAt: string | null
      oraclePriceAt: string | null
    }
  }
}

interface Yesterday {
  pair: Dict<string | undefined>
  oracle: Dict<string | undefined>
}

/* cdp */
interface CDP {
  address: string
  collateralAmount: string
  collateralRatio: string
  collateralToken: string
  id: string
  mintAmount: string
  token: string
}
