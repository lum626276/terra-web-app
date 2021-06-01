import { useContractsAddress } from "../hooks"
import AssetIcon from "./AssetIcon"
import styles from "./AssetItem.module.scss"

interface Props {
  token: string
}

const AssetItem = ({ token }: Props) => {
  const { whitelist, getSymbol } = useContractsAddress()
  const symbol = getSymbol(token)
  const { name } = whitelist[token]

  return (
    <div className={styles.asset}>
      <AssetIcon symbol={symbol} />
      <header className={styles.title}>
        <h1 className={styles.symbol}>{symbol}</h1>
        <p className={styles.name}>{name}</p>
      </header>
    </div>
  )
}

export default AssetItem
