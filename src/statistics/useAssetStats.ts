import { useQuery } from "@apollo/client"
import { ASSETSTATS } from "./gqldocs"
import { StatsNetwork } from "./useDashboard"
import { useStats } from "./useStats"
import useStatsClient from "./useStatsClient"

export default (network = StatsNetwork.TERRA) => {
  const { getAssets, store } = useStats()
  const client = useStatsClient()

  const result = useQuery<{ assets: AssetStatsData[] }>(ASSETSTATS, {
    variables: { network: network.toUpperCase() },
    client,
    onCompleted: ({ assets }) => store.assets(parse(assets), network),
  })

  return { ...result, ...getAssets(network) }
}

/* parse */
const parse = (assets: AssetStatsData[]) => ({
  description: assets.reduce((acc, { token, description }) => {
    return { ...acc, [token]: description }
  }, {}),
  liquidity: assets.reduce((acc, { token, statistic }) => {
    return { ...acc, [token]: statistic.liquidity }
  }, {}),
  volume: assets.reduce((acc, { token, statistic }) => {
    return { ...acc, [token]: statistic.volume }
  }, {}),
  apr: assets.reduce((acc, { token, statistic }) => {
    return { ...acc, [token]: statistic.apr }
  }, {}),
})
