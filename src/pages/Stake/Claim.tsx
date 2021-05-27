import Page from "../../components/Page"
import ClaimForm from "../../forms/ClaimForm"
import { MenuKey } from "../../routes"

const Claim = () => {
  return (
    <Page title={MenuKey.CLAIM}>
      <ClaimForm />
    </Page>
  )
}

export default Claim
