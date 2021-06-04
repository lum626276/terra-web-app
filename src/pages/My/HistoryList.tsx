import Button from "../../components/Button"
import Card from "../../components/Card"
import DownloadCSV from "./DownloadCSV"
import HistoryItem from "./HistoryItem"
import styles from "./HistoryList.module.scss"

interface Props {
  data: Tx[]
  loading: boolean
  more?: () => void
}

const HistoryList = ({ data, loading, more }: Props) => {
  return !data.length ? null : (
    <Card
      title="Transaction History"
      loading={loading}
      action={<DownloadCSV txs={data} />}
    >
      <ul className={styles.list}>
        {data.map((item, index) => (
          <li className={styles.item} key={index}>
            <HistoryItem {...item} />
          </li>
        ))}
      </ul>

      {more && (
        <Button onClick={more} block outline>
          More
        </Button>
      )}
    </Card>
  )
}

export default HistoryList
