import styles from "./AssetIcon.module.scss"

const ICON_URL = "https://whitelist-v2.mirror.finance/images"

interface Props {
  symbol: string
}

const AssetIcon = ({ symbol }: Props) => {
  return (
    <div className={styles.bg}>
      <img src={getIcon(symbol)} className={styles.icon} alt="" />
    </div>
  )
}

export default AssetIcon

/* helpers */
export const getIcon = (symbol: string) =>
  `${ICON_URL}/${symbol.startsWith("m") ? symbol.slice(1) : symbol}.png`
