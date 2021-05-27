import PoolForm from "../forms/PoolForm"
import { PoolType } from "../types/Types"

const Pool = ({ type }: { type: PoolType }) => {
  return <PoolForm type={type} key={type} />
}

export default Pool
