import classNames from "classnames"
import Tooltip from "../lang/Tooltip.json"
import { times, div, gt, gte, lt } from "../libs/math"
import { percent, percentage } from "../libs/num"
import Progress from "../components/Progress"
import { TooltipIcon } from "../components/Tooltip"
import Formatted from "../components/Formatted"
import styles from "./CollateralRatio.module.scss"

interface Props {
  min: string
  safe: string
  ratio: string
  compact?: boolean
  onClick?: (ratio: string) => void
}

const MAX = 4 // 400%
const getX = (ratio: string) => {
  const x = div(ratio, MAX)
  return lt(x, 0) ? "0" : gt(x, 1) ? "1" : x
}

const CollateralRatio = ({ min, safe, ratio, compact, onClick }: Props) => {
  const minX = {
    x: getX(min),
    label: (
      <TooltipIcon content={Tooltip.Mint.MinCollateralRatio}>
        Min: {percent(min)}
      </TooltipIcon>
    ),
  }

  const safeX = {
    x: getX(safe),
    label: (
      <TooltipIcon content={Tooltip.Mint.SafeCollateralRatio}>
        Safe: {percent(safe)}
      </TooltipIcon>
    ),
  }

  const color = gte(ratio, safe) ? "blue" : lt(ratio, min) ? "red" : "orange"

  return (
    <div className={styles.component}>
      {compact && (
        <span className={classNames(styles.percent, color)}>
          <Formatted unit="%">{percentage(ratio)}</Formatted>
        </span>
      )}

      <Progress
        data={[
          {
            value: gt(ratio, 0) ? getX(ratio) : "0",
            label: gt(ratio, 0) ? percent(ratio) : "",
            color,
          },
        ]}
        axis={compact ? [minX] : [minX, safeX]}
        onClick={onClick ? (value) => onClick(times(value, MAX)) : undefined}
        noLabel={compact}
        compact={compact}
      />
    </div>
  )
}

export default CollateralRatio
