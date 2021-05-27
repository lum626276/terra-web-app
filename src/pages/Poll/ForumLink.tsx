import ExtLink from "../../components/ExtLink"
import MaterialIcon from "../../components/MaterialIcon"
import styles from "./ForumLink.module.scss"

const ForumLink = () => {
  return (
    <ExtLink href="https://forum.mirror.finance" className={styles.link}>
      <section className={styles.main}>
        <MaterialIcon name="question_answer" size={20} />
        <span>Forum discussion is recommended before poll creation</span>
      </section>

      <MaterialIcon name="chevron_right" size={20} className={styles.caret} />
    </ExtLink>
  )
}

export default ForumLink
