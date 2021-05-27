import { ReactNode } from "react"
import classNames from "classnames/bind"
import { abs, gt, gte, lt } from "../libs/math"
import { percent } from "../libs/num"
import Icon from "./Icon"
import styles from "./Change.module.scss"

const cx = classNames.bind(styles)

interface Props {
  price?: ReactNode
  className?: string
  children?: string
  align?: "left" | "center" | "right"
}

const Change = ({ price, className, children, align = "left" }: Props) => {
  const change = children && (gte(abs(children), 0.0001) ? children : "0")

  const render = (change: string) => {
    const up = gt(change, 0)
    const down = lt(change, 0)
    const icon: IconNames | "" = up ? "UpSolid" : down ? "DownSolid" : ""

    return (
      <span className={cx(styles.flex, styles.change, align, { up, down })}>
        {icon && <Icon name={icon} size={10} />}
        {percent(abs(change))}
      </span>
    )
  }

  return price ? (
    <span className={cx(styles.flex, className)}>
      <span className={styles.price}>{price}</span>
      {change && render(change)}
    </span>
  ) : change ? (
    render(change)
  ) : null
}

export default Change
