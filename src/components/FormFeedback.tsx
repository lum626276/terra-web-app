import { FC } from "react"
import classNames from "classnames/bind"
import Icon from "./Icon"
import styles from "./FormFeedback.module.scss"

const cx = classNames.bind(styles)

type Type = "error" | "warn" | "help"

const FormFeedback: FC<{ type: Type }> = ({ children, type }) => {
  const icon = {
    error: "ExclamationCircleSolid",
    warn: "ExclamationTriangleSolid",
    help: "InfoCircle",
  }[type] as IconNames

  return (
    <div className={cx(styles.component, type)}>
      <Icon name={icon} className={styles.icon} size={16} />
      <div>{children}</div>
    </div>
  )
}

export default FormFeedback
