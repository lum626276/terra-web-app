import useHash from "../libs/useHash"
import PoolForm from "../forms/PoolForm"

export enum Type {
  LONG = "long",
  SHORT = "short",
}

const Pool = () => {
  const { hash: type } = useHash<Type>()
  return <PoolForm type={type} key={type} />
}

export default Pool
