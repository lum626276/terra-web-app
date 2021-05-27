import MaterialIcon from "../components/MaterialIcon"
import styles from "./FormIcon.module.scss"

const FormIcon = ({ name }: { name: string }) => (
  <div className={styles.wrapper}>
    <MaterialIcon name={name} size={24} />
  </div>
)

export default FormIcon
