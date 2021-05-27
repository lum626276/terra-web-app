import useHash from "../libs/useHash"
import TradeForm from "../forms/TradeForm"
import { TradeType } from "../types/Types"

const Trade = () => {
  const { hash: type } = useHash<TradeType>()
  return <TradeForm type={type} key={type} />
}

export default Trade
