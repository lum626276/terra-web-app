import classNames from "classnames/bind"
import { format, getIsBig, lookupSymbol } from "../libs/parse"
import styles from "./Formatted.module.scss"

const cx = classNames.bind(styles)

interface Props {
  symbol?: string
  config?: FormatConfig
  children?: string
  unit?: string
  big?: boolean
}

const Formatted = ({ symbol, config, children = "0", unit, big }: Props) => {
  const formatted = format(children, symbol, config)
  const isBig = getIsBig(children, symbol)
  const [integer, decimal] = isBig ? [formatted] : formatted.split(".")

  return (
    <span className={cx({ big })}>
      {integer}
      <small>
        {decimal && "."}
        {decimal} {unit ?? lookupSymbol(symbol)}
      </small>
    </span>
  )
}

export default Formatted
