import { MIR } from "../../constants"
import { gt } from "../../libs/math"
import { formatAsset } from "../../libs/parse"

import Table from "../../components/Table"
import Caption from "../../components/Caption"
import Dl from "../../components/Dl"
import { TooltipIcon } from "../../components/Tooltip"
import LinkButton from "../../components/LinkButton"
import { MyGov } from "./types"
import { getPath, MenuKey } from "../../routes"
import { MenuKey as GovMenuKey } from "../Gov"

const Gov = ({ loading, dataSource, staked }: MyGov) => {
  const dataExists = !!dataSource.length || gt(staked, 0)
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
          key: "id",
        },
        {
          key: "reward",
        },
        {
          key: "actions",
          dataIndex: "id",
          render: (id) => (
            <LinkButton
              to={[getPath(MenuKey.GOV), GovMenuKey.POLL, id].join("/")}
            />
          ),
          align: "right",
          fixed: "right",
        },
      ]}
      dataSource={dataSource}
    />
  )
}

export default Gov
