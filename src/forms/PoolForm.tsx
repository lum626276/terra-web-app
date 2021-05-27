import { useRef } from "react"
import { useLocation } from "react-router-dom"

import useNewContractMsg from "../terra/useNewContractMsg"
import Tooltip from "../lang/Tooltip.json"
import { LP, UST, UUSD } from "../constants"
import { plus, minus, max, gt } from "../libs/math"
import { insertIf } from "../libs/utils"
import { format, lookup, toAmount } from "../libs/parse"
import { percent } from "../libs/num"
import useForm from "../libs/useForm"
import { validate as v, placeholder, step, toBase64 } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import getLpName from "../libs/getLpName"
import { useContractsAddress, useContract } from "../hooks"
import { useRefetch, usePolling } from "../hooks"
import { PriceKey, BalanceKey } from "../hooks/contractKeys"

import FormGroup from "../components/FormGroup"
import Count from "../components/Count"
import { TooltipIcon } from "../components/Tooltip"
import WithPriceChart from "../containers/WithPriceChart"
import { Type } from "../pages/Pool"
import usePoolReceipt from "./receipts/usePoolReceipt"
import useSelectAsset from "./useSelectAsset"
import usePool from "./usePool"
import usePoolShare from "./usePoolShare"
import FormContainer from "./FormContainer"
import FormIcon from "./FormIcon"

enum Key {
  token = "token",
  value = "value",
}

const PoolForm = ({ type }: { type: Type }) => {
  const priceKey = PriceKey.PAIR
  const balanceKey = {
    [Type.LONG]: BalanceKey.TOKEN,
    [Type.SHORT]: BalanceKey.LPSTAKABLE,
  }[type]

  /* context */
  const { state } = useLocation<{ token: string }>()
  const { contracts, whitelist, getSymbol, toToken } = useContractsAddress()
  const { find } = useContract()
  usePolling()

  // Refetch the balance of stakable LP even on stake
  useRefetch([
    priceKey,
    PriceKey.ORACLE,
    BalanceKey.TOKEN,
    BalanceKey.LPTOTAL,
    BalanceKey.LPSTAKED,
  ])

  /* form:validate */
  const validate = ({ value, token }: Values<Key>) => {
    const max = find(balanceKey, token)
    const symbol = getSymbol(token)

    return {
      [Key.value]: v.amount(value, { symbol, max }),
      [Key.token]: v.required(token),
    }
  }

  /* form:hook */
  const initial = { [Key.value]: "", [Key.token]: state?.token ?? "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value, token } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)
  const pairPrice = find(priceKey, token)
  const oraclePrice = find(PriceKey.ORACLE, token)
  const price = gt(pairPrice, 0) ? pairPrice : oraclePrice

  /* form:focus input on select asset */
  const valueRef = useRef<HTMLInputElement>()
  const onSelect = (token: string) => {
    setValue(Key.token, token)
    !value && valueRef.current?.focus()
  }

  /* estimate:uusd */
  const balance = find(balanceKey, token)
  const { pair, lpToken } = whitelist[token] ?? {}

  /* estimate:result */
  const getPool = usePool()
  const pool = token ? getPool({ amount, token }) : undefined
  const toLP = pool?.toLP
  const fromLP = pool?.fromLP
  const estimated = pool?.toLP.estimated

  const uusd = {
    [Type.LONG]: estimated,
    [Type.SHORT]: fromLP?.uusd.amount,
  }[type]

  const total = find(BalanceKey.LPTOTAL, token)
  const lpAfterTx = {
    [Type.LONG]: plus(total, toLP?.value),
    [Type.SHORT]: max([minus(total, amount), "0"]),
  }[type]

  /* share of pool */
  const modifyTotal = {
    [Type.LONG]: (total: string) => plus(total, toLP?.value),
    [Type.SHORT]: (total: string) => minus(total, amount),
  }[type]

  const getPoolShare = usePoolShare(modifyTotal)
  const poolShare = getPoolShare({ amount: lpAfterTx, token })
  const { ratio, lessThanMinimum, minimum } = poolShare

  /* render:form */
  const config = {
    token,
    onSelect,
    priceKey,
    balanceKey,
    formatTokenName: type === Type.SHORT ? getLpName : undefined,
    showDelisted: type === Type.SHORT,
  }

  const select = useSelectAsset(config)
  const delisted = whitelist[token]?.["status"] === "DELISTED"

  const fields = {
    ...getFields({
      [Key.value]: {
        label: {
          [Type.LONG]: (
            <TooltipIcon content={Tooltip.Pool.InputAsset}>Asset</TooltipIcon>
          ),
          [Type.SHORT]: <TooltipIcon content={Tooltip.Pool.LP}>LP</TooltipIcon>,
        }[type],
        input: {
          type: "number",
          step: step(symbol),
          placeholder: placeholder(symbol),
          autoFocus: true,
          ref: valueRef,
        },
        unit: delisted ? symbol : select.button,
        max: gt(balance, 0)
          ? () => setValue(Key.value, lookup(balance, symbol))
          : undefined,
        assets: select.assets,
        help: renderBalance(balance, symbol),
        focused: type === Type.SHORT && select.isOpen,
      },
    }),

    estimated: {
      [Type.LONG]: {
        label: <TooltipIcon content={Tooltip.Pool.InputUST}>{UST}</TooltipIcon>,
        value: toLP?.text,
        help: renderBalance(find(balanceKey, UUSD), UUSD),
        unit: UST,
      },
      [Type.SHORT]: {
        label: (
          <TooltipIcon content={Tooltip.Pool.Output}>Received</TooltipIcon>
        ),
        value: fromLP?.text ?? "-",
      },
    }[type],
  }

  const icons = {
    [Type.LONG]: <FormIcon name="add" />,
    [Type.SHORT]: <FormIcon name="arrow_downward" />,
  }

  /* confirm */
  const prefix = lessThanMinimum ? "<" : ""
  const contents = !gt(price, 0)
    ? undefined
    : [
        {
          title: (
            <TooltipIcon content={Tooltip.Pool.PoolPrice}>
              {gt(pairPrice, 0) ? "Terraswap" : "Oracle"} Price
            </TooltipIcon>
          ),
          content: (
            <Count format={format} symbol={UUSD}>
              {price}
            </Count>
          ),
        },
        ...insertIf(type === Type.LONG, {
          title: (
            <TooltipIcon content={Tooltip.Pool.LPfromTx}>
              LP from Tx
            </TooltipIcon>
          ),
          content: <Count symbol={LP}>{toLP?.value}</Count>,
        }),
        ...insertIf(type === Type.SHORT || gt(balance, 0), {
          title: "LP after Tx",
          content: <Count symbol={LP}>{lpAfterTx}</Count>,
        }),
        {
          title: (
            <TooltipIcon content={Tooltip.Pool.PoolShare}>
              Pool Share after Tx
            </TooltipIcon>
          ),
          content: (
            <Count format={(value) => `${prefix}${percent(value)}`}>
              {lessThanMinimum ? minimum : ratio}
            </Count>
          ),
        },
      ]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = !estimated
    ? []
    : {
        [Type.LONG]: [
          newContractMsg(token, {
            increase_allowance: { amount, spender: pair },
          }),
          newContractMsg(
            contracts["staking"],
            {
              auto_stake: {
                assets: [
                  toToken({ amount, token }),
                  toToken({ amount: estimated, token: UUSD }),
                ],
              },
            },
            { amount: estimated, denom: UUSD }
          ),
        ],
        [Type.SHORT]: [
          newContractMsg(lpToken, {
            send: {
              amount,
              contract: pair,
              msg: toBase64({ withdraw_liquidity: {} }),
            },
          }),
        ],
      }[type]

  const insufficient = !!estimated && gt(estimated, find(balanceKey, UUSD))
  const disabled = invalid || (type === Type.LONG && insufficient)

  /* result */
  const parseTx = usePoolReceipt(type)

  const container = { attrs, contents, disabled, data, parseTx }
  const tax = { pretax: uusd, deduct: type === Type.SHORT }

  return (
    <WithPriceChart token={token}>
      <FormContainer {...container} {...tax}>
        <FormGroup {...fields[Key.value]} />
        {icons[type]}
        <FormGroup {...fields["estimated"]} />
      </FormContainer>
    </WithPriceChart>
  )
}

export default PoolForm
