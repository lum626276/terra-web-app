import styles from "./ResultFooter.module.scss"

const ResultFooter = ({ list }: { list: Content[] }) => {
  return (
    <>
      {list.map(({ title, content }) => (
        <div className={styles.row}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.content}>{content}</p>
        </div>
      ))}
    </>
  )
}

export default ResultFooter
