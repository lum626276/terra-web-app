interface Dashboard {
  assetMarketCap: string
  totalValueLocked: string
  collateralRatio: string
  mirCirculatingSupply: string
  govAPR: string
  govAPY: string

  latest24h: {
    transactions: string
    volume: string
    feeVolume: string
    mirVolume: string
  }

  liquidityHistory: ChartItem[]
  tradingVolumeHistory: ChartItem[]
}

interface ChartItem {
  timestamp: number
  value: string
}

/* asset */
interface AssetStatsData {
  token: string
  description?: string
  statistic: {
    liquidity: string
    volume: string
    apr: APR
  }
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
