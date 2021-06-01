import { useLocation } from "react-router-dom"
import useHash from "../libs/useHash"
import { useContractsAddress, useRefetch } from "../hooks"
import { PriceKey, AssetInfoKey } from "../hooks/contractKeys"
import useMintPosition from "../graphql/queries/useMintPosition"
import MintForm from "../forms/MintForm"
import { MintType } from "../types/Types"

const Mint = () => {
  const { hash: type } = useHash<MintType>()
  const { parseToken, getIsDelisted } = useContractsAddress()
  const keys = [PriceKey.ORACLE, AssetInfoKey.MINCOLLATERALRATIO]
  useRefetch(keys)

  /* idx */
  const { search } = useLocation()
  const idx = new URLSearchParams(search).get("idx") || undefined
  const { parsed } = useMintPosition(idx)
  const invalid = Boolean(idx && !parsed)

  /* type */
  const prevCollateral = parsed && parseToken(parsed.collateral)
  const prevAsset = parsed && parseToken(parsed.asset)
  const prevCollateralDelisted =
    prevCollateral && getIsDelisted(prevCollateral.token)
  const prevAssetDelisted = prevAsset && getIsDelisted(prevAsset.token)
  const delisted = prevCollateralDelisted || prevAssetDelisted

  const manage = delisted
    ? [MintType.WITHDRAW, MintType.CLOSE]
    : [MintType.DEPOSIT, MintType.WITHDRAW, MintType.CLOSE]

  const tab = manage.includes(type)
    ? { tabs: manage, current: type }
    : undefined

  return invalid ? null : (
    <MintForm position={parsed} type={type} tab={tab} key={type} />
  )
}

export default Mint
