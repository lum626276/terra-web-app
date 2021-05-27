import styles from "./AssetIcon.module.scss"

const ICON_URL = "https://whitelist.mirror.finance/images"

interface Props {
  symbol: string
  size?: number
}

const AssetIcon = ({ symbol, size = 24 }: Props) => {
  return (
    <div className={styles.bg}>
      <img src={getIcon(symbol)} width={size} height={size} alt="" />
    </div>
  )
}

export default AssetIcon

/* helpers */
export const getIcon = (symbol: string) =>
  `${ICON_URL}/${symbol.startsWith("m") ? symbol.slice(1) : symbol}.png`