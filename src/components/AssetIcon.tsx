import { useState } from "react"
import classNames from "classnames/bind"
import { UST, UUSD } from "../constants"
import styles from "./AssetIcon.module.scss"

const cx = classNames.bind(styles)

const ICON_URL = "https://whitelist-v2.mirror.finance/images"

interface Props {
  symbol: string
  small?: boolean
  className?: string
}

const AssetIcon = ({ symbol, small, className }: Props) => {
  const [error, setError] = useState(false)

  return error ? null : (
    <div className={cx(styles.bg, { small }, className)}>
      <img
        src={getIcon(symbol)}
        className={styles.icon}
        alt=""
        onError={() => setError(true)}
      />
    </div>
  )
}

export default AssetIcon

/* helpers */
export const getIcon = (symbol: string) => {
  const ticker = symbol.startsWith("m")
    ? symbol.slice(1)
    : symbol === UUSD
    ? UST
    : symbol

  return `${ICON_URL}/${ticker}.png`
}
