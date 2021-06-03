import { FC } from "react"
import classNames from "classnames"
import Icon from "./Icon"
import styles from "./FormFeedback.module.scss"

const FormFeedback: FC<{ help?: boolean }> = ({ children, help }) => {
  const icon = { size: 16, className: styles.icon }

  return (
    <div
      className={classNames(styles.component, help ? styles.help : styles.warn)}
    >
      {help ? (
        <Icon name="InfoCircle" {...icon} />
      ) : (
        <Icon name="ExclamationTriangleSolid" {...icon} />
      )}

      <div>{children}</div>
    </div>
  )
}

export default FormFeedback
