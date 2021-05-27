import { ReactNode } from "react"
import LoadingTitle from "./LoadingTitle"
import styles from "./Caption.module.scss"

interface Props {
  title: ReactNode
  description?: ReactNode
  loading?: boolean
}

const Caption = ({ title, description, loading }: Props) => {
  return (
    <div className={styles.component}>
      <LoadingTitle loading={loading} size={16}>
        {title}
      </LoadingTitle>

      {description}
    </div>
  )
}

export default Caption
