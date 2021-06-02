import { useLocation } from "react-router-dom"
import Tooltip from "../lang/Tooltip.json"
import { toBase64 } from "../libs/formHelpers"
import useNewContractMsg from "../terra/useNewContractMsg"
import { LP, MIR } from "../constants"
import { gt, minus, max as findMax } from "../libs/math"
import { formatAsset, lookup, toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, placeholder, step } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import getLpName from "../libs/getLpName"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"

import FormGroup from "../components/FormGroup"
import FormFeedback from "../components/FormFeedback"
import { TooltipIcon } from "../components/Tooltip"
import WithPriceChart from "../containers/WithPriceChart"
import { StakeType } from "../types/Types"
import useStakeReceipt from "./receipts/useStakeReceipt"
import usePool from "./usePool"
import FormContainer from "./FormContainer"
import FormIcon from "./FormIcon"

enum Key {
  value = "value",
}

interface Props {
  type: StakeType
  token?: string
  tab?: Tab
  /** Gov stake */
  gov?: boolean
}

const StakeForm = ({ type, tab, gov, ...props }: Props) => {
  const balanceKey = (
    !gov
      ? {
          [StakeType.STAKE]: BalanceKey.LPSTAKABLE,
          [StakeType.UNSTAKE]: BalanceKey.LPSTAKED,
        }
      : {
          [StakeType.STAKE]: BalanceKey.TOKEN,
          [StakeType.UNSTAKE]: BalanceKey.MIRGOVSTAKED,
        }
  )[type as StakeType]

  /* context */
  const { state } = useLocation<{ token: string }>()
  const token = props.token ?? state?.token
  const { contracts, whitelist, getSymbol } = useContractsAddress()
  const { find, parsed } = useContract()
  useRefetch([balanceKey, !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED])

  const getLocked = () =>
    findMax(
      parsed[BalanceKey.MIRGOVSTAKED]?.locked_balance?.map(
        ([, { balance }]: LockedBalance) => balance
      ) ?? [0]
    )

  const lockedIds = parsed[BalanceKey.MIRGOVSTAKED]?.locked_balance
    ?.map(([id]: LockedBalance) => id)
    .join(", ")

  const getMax = () => {
    const balance = find(balanceKey, token)
    const locked = getLocked()

    return gov && type === StakeType.UNSTAKE && gt(locked, 0)
      ? minus(balance, locked)
      : balance
  }

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const symbol = getSymbol(token)
    return { [Key.value]: v.amount(value, { symbol, max: getMax() }) }
  }

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)

  /* estimate */
  const getPool = usePool()
  const pool = token ? getPool({ amount, token }) : undefined
  const fromLP = pool?.fromLP

  /* render:form */
  const max = getMax()
  const locked = getLocked()
  const fields = getFields({
    [Key.value]: {
      label: "Amount",
      input: {
        type: "number",
        step: step(symbol),
        placeholder: placeholder(symbol),
        autoFocus: true,
      },
      help: renderBalance(max, symbol),
      unit: gov ? MIR : LP,
      max: gt(max, 0)
        ? () => setValue(Key.value, lookup(max, symbol))
        : undefined,
    },
  })

  const estimatedField = {
    label: <TooltipIcon content={Tooltip.Pool.Output}>Received</TooltipIcon>,
    value: fromLP?.text ?? "-",
  }

  /* confirm */
  const staked = find(
    !gov ? BalanceKey.LPSTAKED : BalanceKey.MIRGOVSTAKED,
    token
  )

  const contents = !value
    ? undefined
    : gt(staked, 0)
    ? [
        {
          title: "Staked",
          content: formatAsset(staked, !gov ? getLpName(symbol) : MIR),
        },
      ]
    : []

  /* submit */
  const newContractMsg = useNewContractMsg()
  const { pair, lpToken } = whitelist[token] ?? {}
  const assetToken = { asset_token: token }
  const data = {
    [StakeType.STAKE]: [
      gov
        ? newContractMsg(contracts["mirrorToken"], {
            send: {
              amount,
              contract: contracts["gov"],
              msg: toBase64({ stake_voting_tokens: {} }),
            },
          })
        : newContractMsg(lpToken, {
            send: {
              amount,
              contract: contracts["staking"],
              msg: toBase64({ bond: assetToken }),
            },
          }),
    ],
    [StakeType.UNSTAKE]: gov
      ? [
          newContractMsg(contracts["gov"], {
            withdraw_voting_tokens: { amount },
          }),
        ]
      : [
          newContractMsg(contracts["staking"], {
            unbond: { ...assetToken, amount },
          }),
          newContractMsg(lpToken, {
            send: {
              amount,
              contract: pair,
              msg: toBase64({ withdraw_liquidity: {} }),
            },
          }),
        ],
  }[type as StakeType]

  const messages =
    gov && type === StakeType.UNSTAKE && gt(locked, 0)
      ? [`${formatAsset(locked, MIR)} are voted in poll ${lockedIds}`]
      : undefined

  const disabled = invalid

  /* result */
  const parseTx = useStakeReceipt(!!gov)

  const container = { attrs, contents, messages, disabled, data, parseTx }

  return (
    <WithPriceChart token={token}>
      <FormContainer {...container}>
        <FormGroup {...fields[Key.value]} />

        {type === StakeType.UNSTAKE && (
          <>
            <FormIcon name="arrow_downward" />
            <FormGroup {...estimatedField} />
          </>
        )}

        {gov && type === StakeType.STAKE && (
          <FormFeedback help>{Tooltip.My.GovReward}</FormFeedback>
        )}
      </FormContainer>
    </WithPriceChart>
  )
}

export default StakeForm
