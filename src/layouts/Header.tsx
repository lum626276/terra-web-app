import { DOCS } from "../constants"
import { useNetwork } from "../hooks"
import ExtLink from "../components/ExtLink"
import Badge from "../components/Badge"
import styles from "./Header.module.scss"

const Header = () => {
  const { name } = useNetwork()

  return (
    <header className={styles.header}>
      {name !== "mainnet" && <Badge bg="red">Testnet</Badge>}

      <ExtLink href={DOCS} className={styles.item}>
        Docs
      </ExtLink>
    </header>
  )
}

export default Header
