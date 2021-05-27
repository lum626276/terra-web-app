import { useLocation } from "react-router-dom"
import useHash from "../libs/useHash"
import { useRefetch } from "../hooks"
import { PriceKey, AssetInfoKey } from "../hooks/contractKeys"
import useMintPosition from "../graphql/queries/useMintPosition"
import MintForm from "../forms/MintForm"

export enum Type {
  BORROW = "borrow",
  SHORT = "short",
  CLOSE = "close",
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  CUSTOM = "custom",
}

const Mint = () => {
  const { hash: type } = useHash<Type>()
  const keys = [PriceKey.ORACLE, AssetInfoKey.MINCOLLATERALRATIO]
  useRefetch(keys)

  /* type */
  const tab = [Type.DEPOSIT, Type.WITHDRAW].includes(type)
    ? { tabs: [Type.DEPOSIT, Type.WITHDRAW], current: type }
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
