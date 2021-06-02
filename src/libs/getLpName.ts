import { LP, SLP } from "../constants"
import { FarmingType } from "../pages/My/types"

const getLpName = (symbol: string, type: FarmingType = "long") =>
  `${[symbol, "UST"].join("-")} ${type === "long" ? LP : SLP}`

export default getLpName
