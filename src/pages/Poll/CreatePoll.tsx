import useHash from "../../libs/useHash"
import Page from "../../components/Page"
import Container from "../../components/Container"
import Grid from "../../components/Grid"
import List from "../../components/List"
import CreatePollForm from "../../forms/CreatePollForm"
import ForumLink from "./ForumLink"

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

const Groups = [
  {
    title: "Asset Listing",
    items: [PollType.WHITELIST],
  },
  {
    title: "Reward Distribution Ratio",
    items: [PollType.INFLATION],
  },
  {
    title: "Parameters",
    items: [PollType.MINT_UPDATE, PollType.GOV_UPDATE],
  },
  {
    title: "Suggestions/Others",
    items: [PollType.TEXT_WHITELIST, PollType.TEXT_PREIPO, PollType.TEXT],
  },
]

const polls = {
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
  const { hash: type } = useHash<PollType>(PollType.TEXT_WHITELIST)

  return (
    <Page>
      <Container>
        <ForumLink />

        <Grid>
          <section>
            <List
              groups={Groups.map(({ title, items }) => ({
                title,
                items: items.map((key) => ({
                  label: polls[key].title,
                  to: { hash: key },
                })),
              }))}
            />
          </section>

          {type && (
            <CreatePollForm headings={polls[type]} type={type} key={type} />
          )}
        </Grid>
      </Container>
    </Page>
  )
}

export default CreatePoll
