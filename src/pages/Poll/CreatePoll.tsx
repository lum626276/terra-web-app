import useHash from "../../libs/useHash"
import Page from "../../components/Page"
import Container from "../../components/Container"
import Card from "../../components/Card"
import CreatePollForm from "../../forms/CreatePollForm"
import { MenuKey } from "../Gov"
import ForumLink from "./ForumLink"
import CreatePollButton from "./CreatePollButton"
import styles from "./CreatePoll.module.scss"

export enum PollType {
  TEXT = "TEXT",
  TEXT_PREIPO = "TEXT_PREIPO",
  TEXT_WHITELIST = "TEXT_WHITELIST",
  WHITELIST = "WHITELIST",
  INFLATION = "INFLATION",
  MINT_UPDATE = "MINT_UPDATE",
  GOV_UPDATE = "GOV_UPDATE",
  COMMUNITY_SPEND = "COMMUNITY_SPEND",
}

const TITLE = "Choose a poll"
const Buttons: Record<PollType, { title: string; desc: string }> = {
  [PollType.TEXT]: {
    title: "Submit text poll",
    desc: "Upload a text poll",
  },
  [PollType.TEXT_WHITELIST]: {
    title: "Whitelist a new mAsset",
    desc: "Submit a poll to whitelist a new mAsset",
  },
  [PollType.TEXT_PREIPO]: {
    title: "Pre-IPO",
    desc: "Start trading assets scheduled to be offered publicly",
  },
  [PollType.WHITELIST]: {
    title: "Register whitelist parameters",
    desc: "Register the parameters for a newly whitelisted mAsset",
  },
  [PollType.INFLATION]: {
    title: "Modify weight parameter",
    desc: "Modify reward distribution parameter of an existing mAsset",
  },
  [PollType.MINT_UPDATE]: {
    title: "Modify mint parameters",
    desc: "Modify the mint parameters of an existing mAsset",
  },
  [PollType.GOV_UPDATE]: {
    title: "Modify governance parameters",
    desc: "Modify the governance parameters",
  },
  [PollType.COMMUNITY_SPEND]: {
    title: "Spend community pool",
    desc: "Submit community pool spending poll",
  },
}

const CreatePoll = () => {
  const { hash: type } = useHash<PollType>()

  return (
    <Page title={!type ? MenuKey.CREATE : Buttons[type].title}>
      {!type ? (
        <Container sm>
          <ForumLink />

          <Card lg>
            <header className={styles.header}>
              <h1 className={styles.title}>{TITLE}</h1>
            </header>

            {Object.entries(Buttons).map(([key, item]) => (
              <CreatePollButton {...item} hash={key} key={key} />
            ))}
          </Card>
        </Container>
      ) : (
        <CreatePollForm type={type} key={type} />
      )}
    </Page>
  )
}

export default CreatePoll
