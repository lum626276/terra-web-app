import { FC, InputHTMLAttributes } from "react"
import Icon from "./Icon"
import styles from "./Search.module.scss"

type Attrs = InputHTMLAttributes<HTMLInputElement>

const Search: FC<Attrs> = ({ children, ...attrs }) => {
  return (
    <section className={styles.component}>
      <section className={styles.icon}>
        <Icon name="Search" />
      </section>

      <input {...attrs} className={styles.input} />

      <section className={styles.payload}>{children}</section>
    </section>
  )
}

export default Search
