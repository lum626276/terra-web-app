import { useState } from "react"
import Contents from "../lang/Caution.json"
import { useSettings } from "../hooks"
import Card from "../components/Card"
import Button, { Submit } from "../components/Button"
import Checkbox from "../components/Checkbox"
import styles from "./Caution.module.scss"

const { title, content, footer } = Contents
const { introduction, body, conclusion } = content

interface Props extends Button {
  onAgree?: () => void
}

const Caution = ({ onAgree = () => {} }: Props) => {
  const [checked, setChecked] = useState(false)
  const { agreementState } = useSettings()
  const [, agree] = agreementState

  const handleClick = () => {
    agree(true)
    onAgree()
  }

  return (
    <>
      <Card>
        <article className={styles.article}>
          <h1 className={styles.title}>{title}</h1>

          <p>{introduction}</p>

          <ol className={styles.list}>
            {body.map(({ title, content }, index) => (
              <li key={title}>
                <article>
                  <h1>
                    {index + 1}. {title}
                  </h1>
                  <p>{content}</p>
                </article>
              </li>
            ))}
          </ol>

          <p className={styles.conclusion}>{conclusion}</p>
        </article>
      </Card>

      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.label}
          onClick={() => setChecked(!checked)}
        >
          <Checkbox checked={checked}>{footer}</Checkbox>
        </button>
      </footer>

      <Submit>
        <Button
          onClick={handleClick}
          disabled={!checked}
          type="button"
          size="lg"
        >
          Agree
        </Button>
      </Submit>
    </>
  )
}

export default Caution
