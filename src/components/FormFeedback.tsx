import { FC } from "react"
import classNames from "classnames/bind"
import MaterialIcon from "./MaterialIcon"
import styles from "./FormFeedback.module.scss"

const cx = classNames.bind(styles)

const FormFeedback: FC<{ help?: boolean }> = ({ children, help }) => {
  const icon = { size: 16, className: cx(styles.icon, { red: !help }) }

  return (
    <div className={cx(styles.component, { help })}>
      {help ? (
        <MaterialIcon name="info_outline" {...icon} />
      ) : (
        <MaterialIcon name="warning" {...icon} />
      )}

      <div>{children}</div>
    </div>
  )
}

export default FormFeedback
