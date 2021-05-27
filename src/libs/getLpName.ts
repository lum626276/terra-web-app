import { LP, SLP } from "../constants"
import { FarmType } from "../pages/My/types"

const getLpName = (symbol: string, type: FarmType = "long") =>
  `${[symbol, "UST"].join("-")} ${type === "long" ? LP : SLP}`

export default getLpName
