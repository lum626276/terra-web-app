import { uniq } from "ramda"
import { useContractsAddress } from "../hooks"
import useMy from "../pages/My/useMy"
import DelistModal from "./DelistModal"

const DelistAlert = () => {
  const { delist } = useContractsAddress()

  const filter = <T extends { token: string }>({ token }: T) => !!delist[token]

  const my = useMy()
  const { holdings, mint, stake, orders } = my

  const delistedHoldings = holdings.dataSource.filter(filter).map(getToken)

  const delistedMintTokens = mint.dataSource.reduce<string[]>(
    (acc, { collateralAsset, mintedAsset }) =>
      acc
        .concat(delist[collateralAsset.token] ? collateralAsset.token : [])
        .concat(delist[mintedAsset.token] ? mintedAsset.token : []),
    []
  )

  const delistedStakedTokens = stake.dataSource.filter(filter).map(getToken)
  const delistedOrderTokens = orders.dataSource.filter(filter).map(getToken)

  const delistedTokens = uniq([
    ...delistedHoldings,
    ...delistedMintTokens,
    ...delistedStakedTokens,
    ...delistedOrderTokens,
  ])

  return delistedTokens.length ? <DelistModal tokens={delistedTokens} /> : null
}

export default DelistAlert

/* helpers */
const getToken = <T extends { token: string }>({ token }: T) => token
