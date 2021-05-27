import { NavLink } from "react-router-dom"
import ConnectButton from "../components/ConnectButton"
import { getPath, MenuKey } from "../routes"
import Balance from "./Balance"
import styles from "./Connected.module.scss"

const Connected = () => {
  return (
    <>
      <NavLink to={getPath(MenuKey.MY)}>
        <ConnectButton>
          <div className={styles.button}>
            <Balance />
          </div>
        </ConnectButton>
      </NavLink>
    </>
  )
}

export default Connected
