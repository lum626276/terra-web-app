import { useLocation } from "react-router-dom"
import useHash from "../libs/useHash"
import { useRefetch } from "../hooks"
import { PriceKey, AssetInfoKey } from "../hooks/contractKeys"
import useMintPosition from "../graphql/queries/useMintPosition"
import MintForm from "../forms/MintForm"
import { MintType } from "../types/Types"

const Mint = () => {
  const { hash: type } = useHash<MintType>()
  const keys = [PriceKey.ORACLE, AssetInfoKey.MINCOLLATERALRATIO]
  useRefetch(keys)

  /* type */
  const tab = [MintType.DEPOSIT, MintType.WITHDRAW].includes(type)
    ? { tabs: [MintType.DEPOSIT, MintType.WITHDRAW], current: type }
    : undefined

  /* idx */
  const { search } = useLocation()
  const idx = new URLSearchParams(search).get("idx") || undefined
  const { parsed } = useMintPosition(idx)
  const invalid = Boolean(idx && !parsed)

  return invalid ? null : (
    <MintForm position={parsed} type={type} tab={tab} key={type} />
  )
}

export default Mint
