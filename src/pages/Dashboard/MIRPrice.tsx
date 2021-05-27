import { MIR, UST } from "../../constants"
import { useContract, useContractsAddress, useRefetch } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import useYesterday, { calcChange } from "../../statistics/useYesterday"
import Card from "../../components/Card"
import Formatted from "../../components/Formatted"
import Change from "../../components/Change"

const MIRPrice = () => {
  const { getToken } = useContractsAddress()
  const { find } = useContract()
  const yesterday = useYesterday()
  useRefetch([PriceKey.PAIR])

  const price = find(PriceKey.PAIR, getToken(MIR))
  const priceYesterday = yesterday[PriceKey.PAIR][getToken(MIR)]

  return (
    <Card title="MIR Price" lg>
      <Formatted unit={UST} big>
        {price}
      </Formatted>

      <footer>
        <Change>
          {calcChange({ yesterday: priceYesterday, today: price })}
        </Change>
      </footer>
    </Card>
  )
}

export default MIRPrice
