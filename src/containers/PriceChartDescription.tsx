import { useState } from "react"
import classNames from "classnames/bind"
import styles from "./PriceChartDescription.module.scss"

const cx = classNames.bind(styles)

const PriceChartDescription = ({ children = "" }) => {
  const isLong = children.split(" ").length
  const [isOpen, setIsOpen] = useState(!isLong)
  const toggle = () => setIsOpen((isOpen) => !isOpen)

  return !children ? null : isLong ? (
    <button className={styles.component} onClick={toggle}>
      <p className={cx({ collapsed: !isOpen })}>{children}</p>
      {isLong && !isOpen && <span className={styles.button}>More</span>}
    </button>
  ) : (
    <p className={styles.component}>{children}</p>
  )
}

export default PriceChartDescription
