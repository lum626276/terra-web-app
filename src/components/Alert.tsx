import { FC } from "react"
import MaterialIcon from "./MaterialIcon"
import styles from "./Alert.module.scss"

interface Props {
  isOpen: boolean
  onClose: () => void
}

const Alert: FC<Props> = ({ isOpen, onClose, children }) =>
  !isOpen ? null : (
    <div className={styles.component}>
      <section className={styles.main}>
        <MaterialIcon name="info" size={16} />
        {children}
      </section>

      <button className={styles.close} onClick={onClose}>
        <MaterialIcon name="close" size={16} />
      </button>
    </div>
  )

export default Alert
