import { useParams, useRouteMatch } from "react-router"
import { useContract, useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import { useGov } from "../../graphql/useGov"
import { Submit } from "../../components/Button"
import LinkButton from "../../components/LinkButton"

const VoteLink = ({ id, end_height }: Poll) => {
  const { url } = useRouteMatch()
  const params = useParams<{ id: string }>()
  const { parsed } = useContract()
  const { polls } = useGov()
  const { height } = polls

  useRefetch([BalanceKey.GOVSTAKED])

  const alreadyVoted = parsed[BalanceKey.GOVSTAKED]?.locked_balance.some(
    ([lockedId]: LockedBalance) => id === lockedId
  )

  const end = height && height > end_height

  return params.id && !end ? (
    <Submit>
      <LinkButton to={url + "/vote"} disabled={alreadyVoted}>
        {alreadyVoted ? "Voted" : "Vote"}
      </LinkButton>
    </Submit>
  ) : null
}

export default VoteLink
