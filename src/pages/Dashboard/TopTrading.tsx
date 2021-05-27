import TopTradingTable from "./TopTradingTable"
import styles from "./TopTrading.module.scss"
import Icon from "../../components/Icon"
import { Link } from "react-router-dom"
import { getPath, MenuKey } from "../../routes"

const TopTrading = () => {
  return (
    <article>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <Icon name="Chart" size={22} />
          <h1 className={styles.title}>Top Trading</h1>
        </div>

        <Link to={getPath(MenuKey.MARKET)} className={styles.link}>
          View all
          <Icon name="ChevronRight" size={8} />
        </Link>
      </header>

      <TopTradingTable />
    </article>
  )
}

export default TopTrading
