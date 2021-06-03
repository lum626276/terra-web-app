import { Link } from "react-router-dom"
import { MIR, UUSD } from "../../constants"
import { gt, minus } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { useContract, useRefetch } from "../../hooks"
import { AccountInfoKey } from "../../hooks/contractKeys"
import { getPath, MenuKey } from "../../routes"
import Card, { CardMain } from "../../components/Card"
import Grid from "../../components/Grid"
import Formatted from "../../components/Formatted"
import LinkButton from "../../components/LinkButton"
import DoughnutChart from "../../containers/DoughnutChart"
import BuyLinks from "../../components/BuyLinks"
import Icon from "../../components/Icon"
import { My } from "./types"
import styles from "./TotalValue.module.scss"

const TotalValue = ({ total, holding, borrowing, farming }: My) => {
  const { value } = total
  const { totalRewards, totalRewardsValue } = farming
  const { uusd } = useContract()
  const shouldBuyUST = useShouldBuyUST()

  const claimAll = (
    <CardMain>
      <LinkButton
        to={getPath(MenuKey.CLAIM)}
        disabled={!gt(totalRewards, 0)}
        size="lg"
        block
      >
        Claim All Rewards
      </LinkButton>
    </CardMain>
  )

  return (
    <Grid>
      <Card
        title="Total Value"
        footer={
          shouldBuyUST && (
            <CardMain>
              <BuyLinks type="terra" />
            </CardMain>
          )
        }
        action={
          <Link to={getPath(MenuKey.SEND)} className={styles.send}>
            <Icon name="Send" />
            Send
          </Link>
        }
      >
        <Formatted symbol={UUSD} big>
          {value}
        </Formatted>

        {!shouldBuyUST && (
          <DoughnutChart
            list={[
              { label: "UST", value: uusd },
              { label: "Holding", value: holding.totalValue },
              {
                label: "Borrowing",
                value: minus(
                  borrowing.totalCollateralValue,
                  borrowing.totalMintedValue
                ),
              },
              { label: "Farming", value: farming.totalWithdrawableValue },
            ]}
            format={(value) => formatAsset(value, UUSD)}
          />
        )}
      </Card>

      <Card title="Total Rewards" footer={claimAll}>
        <p>
          <Formatted symbol={MIR} big>
            {totalRewards}
          </Formatted>
        </p>

        <p className="muted">
          <Formatted symbol={UUSD}>{totalRewardsValue}</Formatted>
        </p>
      </Card>
    </Grid>
  )
}

export default TotalValue

/* hooks */
const useShouldBuyUST = () => {
  const { uusd } = useContract()
  const { data } = useRefetch([AccountInfoKey.UUSD])
  return !!data && !gt(uusd, 0)
}
