import { FC } from "react"
import { Link, useLocation } from "react-router-dom"
import classNames from "classnames/bind"
import { capitalize } from "../libs/utils"
import { TooltipIcon } from "./Tooltip"
import styles from "./Tab.module.scss"

const cx = classNames.bind(styles)

const Tab: FC<Tab> = ({ tabs, tooltips, current, children, onClick }) => {
  const { search, state } = useLocation()

  return !current ? null : (
    <>
      <section className={styles.tabs}>
        {tabs.map((tab, index) => {
          const to = { hash: tab, search, state }
          const tooltip = tooltips?.[index]
          const label = tooltip ? (
            <TooltipIcon content={tooltip}>{capitalize(tab)}</TooltipIcon>
          ) : (
            capitalize(tab)
          )

          const attrs = {
            className: cx(styles.tab, { active: tab === current }),
            key: tab,
            children: label,
          }

          return onClick ? (
            <button {...attrs} onClick={() => onClick(tab)} />
          ) : tab === current ? (
            <span {...attrs} />
          ) : (
            <Link {...attrs} replace to={to} />
          )
        })}
      </section>

      {children && <section className={styles.content}>{children}</section>}
    </>
  )
}

export default Tab
