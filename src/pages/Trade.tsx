import useHash from "../libs/useHash"
import TradeForm from "../forms/TradeForm"

export enum Type {
  BUY = "buy",
  SELL = "sell",
}

const Trade = () => {
  const { hash: type } = useHash<Type>()
  return <TradeForm type={type} key={type} />
}

export default Trade
