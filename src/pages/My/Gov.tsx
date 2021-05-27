import { MIR } from "../../constants"
import { formatAsset } from "../../libs/parse"

import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Dl from "../../components/Dl"
import { TooltipIcon } from "../../components/Tooltip"
import DashboardActions from "../../components/DashboardActions"
import { MyGov } from "./types"

const Gov = ({ loading, dataSource, staked }: MyGov) => {
  const dataExists = !!dataSource.length
  const description = dataExists && (
    <Dl list={[{ title: "Staked MIR", content: formatAsset(staked, MIR) }]} />
  )

  return (
    <Table
      caption={
        <Caption
          title={<TooltipIcon>Govern</TooltipIcon>}
          description={description}
          loading={loading}
        />
      }
      columns={[
        {
          key: "actions",
          render: () => <DashboardActions list={[]} />,
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default Gov
