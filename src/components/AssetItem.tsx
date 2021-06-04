import { useContractsAddress } from "../hooks"
import { lookupSymbol } from "../libs/parse"
import AssetIcon from "./AssetIcon"
import Delisted from "./Delisted"
import styles from "./AssetItem.module.scss"

interface Props {
  token: string
  small?: boolean
  formatTokenName?: (symbol: string) => string
}

const AssetItem = ({ token, formatTokenName, small }: Props) => {
  const { whitelist, getSymbol, getIsDelisted } = useContractsAddress()
  const symbol = getSymbol(token)
  const name = whitelist[token]?.name

  return (
    <div className={styles.asset}>
      <AssetIcon symbol={symbol} small={small} />

      <header className={styles.title}>
        {getIsDelisted(token) && <Delisted />}

        <h1 className={styles.symbol}>
          {formatTokenName?.(symbol) ?? lookupSymbol(symbol)}
        </h1>

        {name && <p className={styles.name}>{name}</p>}
      </header>
    </div>
  )
}

export default AssetItem
