import { Link } from "react-router-dom"
import { LocationDescriptor } from "history"
import { useContractsAddress } from "../hooks"
import AssetIcon from "./AssetIcon"
import styles from "./AssetItem.module.scss"

interface Props {
  token: string
  to: LocationDescriptor
}

const AssetItem = ({ token, to }: Props) => {
  const { whitelist, getSymbol } = useContractsAddress()
  const symbol = getSymbol(token)
  const { name } = whitelist[token]

  return (
    <div className={styles.asset}>
      <AssetIcon symbol={symbol} />
      <Link className={styles.title} to={to}>
        <h1 className={styles.symbol}>{symbol}</h1>
        <p className={styles.name}>{name}</p>
      </Link>
    </div>
  )
}

export default AssetItem
