import { uniq } from "ramda"
import { useContractsAddress } from "../hooks"
import useMy from "../pages/My/useMy"
import DelistModal from "./DelistModal"

const DelistAlert = () => {
  const { delist } = useContractsAddress()

  const filter = <T extends { token: string }>({ token }: T) => !!delist[token]

  const my = useMy()
  const { holding, borrowing, farming, limitOrder } = my

  const delistedHolding = holding.dataSource.filter(filter).map(getToken)

  const delistedBorrowingTokens = borrowing.dataSource.reduce<string[]>(
    (acc, { collateralAsset, mintedAsset }) =>
      acc
        .concat(delist[collateralAsset.token] ? collateralAsset.token : [])
        .concat(delist[mintedAsset.token] ? mintedAsset.token : []),
    []
  )

  const delistedFarmingTokens = farming.dataSource.filter(filter).map(getToken)
  const delistedLimitOrderTokens = limitOrder.dataSource
    .filter(filter)
    .map(getToken)

  const delistedTokens = uniq([
    ...delistedHolding,
    ...delistedBorrowingTokens,
    ...delistedFarmingTokens,
    ...delistedLimitOrderTokens,
  ])

  return delistedTokens.length ? <DelistModal tokens={delistedTokens} /> : null
}

export default DelistAlert

/* helpers */
const getToken = <T extends { token: string }>({ token }: T) => token
