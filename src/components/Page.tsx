import { FC, ReactNode } from "react"
import { DOCS } from "../constants"
import Container from "./Container"
import ExtLink from "./ExtLink"
import MaterialIcon from "./MaterialIcon"
import styles from "./Page.module.scss"

interface Props {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  select?: ReactNode
  doc?: string
  sm?: boolean
}

const Page: FC<Props> = ({ title, description, children, ...props }) => {
  const { doc, action, select, sm } = props

  return (
    <article className={styles.article}>
      {title && (
        <header className={styles.header}>
          <section className={styles.heading}>
            <h1 className={styles.title}>{title}</h1>

            {select && (
              <div className={styles.select}>
                {select}
                <MaterialIcon name="arrow_drop_down" size={18} />
              </div>
            )}

            {doc && (
              <ExtLink href={DOCS + doc} className={styles.doc}>
                <MaterialIcon
                  name="article"
                  size={12}
                  className={styles.icon}
                />
                Docs
              </ExtLink>
            )}
          </section>
          {action && <section className={styles.action}>{action}</section>}
        </header>
      )}

      {description && (
        <section className={styles.description}>{description}</section>
      )}

      {sm ? <Container sm>{children}</Container> : children}
    </article>
  )
}

export default Page
