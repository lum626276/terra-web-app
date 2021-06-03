import classNames from "classnames/bind"
import styles from "./AssetIcon.module.scss"

const cx = classNames.bind(styles)

const ICON_URL = "https://whitelist-v2.mirror.finance/images"

interface Props {
  symbol: string
  small?: boolean
  className?: string
}

const AssetIcon = ({ symbol, small, className }: Props) => {
  return (
    <div className={cx(styles.bg, { small }, className)}>
      <img src={getIcon(symbol)} className={styles.icon} alt="" />
    </div>
  )
}

export default AssetIcon

/* helpers */
export const getIcon = (symbol: string) =>
  `${ICON_URL}/${symbol.startsWith("m") ? symbol.slice(1) : symbol}.png`
