import { FC } from "react"
import styles from "./Legend.module.scss"

const $blue = "#66adff"
const $blue62 = "#55779d"
const $blue38 = "#4a5460"
const $gray24 = "#3d3d3d"

export const colors = [$blue, $blue62, $blue38, $gray24]

interface Props {
  index: number
  label: string
}

const Legend: FC<Props> = ({ index, label, children }) => {
  return (
    <>
      <header className={styles.header}>
        <div
          className={styles.square}
          style={{ backgroundColor: colors[index] }}
        />
        <h1 className={styles.label}>{label}</h1>
      </header>

      <p className={styles.value}>{children}</p>
    </>
  )
}

export default Legend
