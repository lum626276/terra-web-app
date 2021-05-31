import useNewContractMsg from "../terra/useNewContractMsg"
import Tooltip from "../lang/Tooltip.json"
import { MAX_MSG_LENGTH, MIR } from "../constants"
import { div, gte, number, times } from "../libs/math"
import { record, getLength } from "../libs/utils"
import { lookup, toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, step, toBase64, placeholder } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import { useRefetch, useContractsAddress, useContract } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"
import { GovKey, useGov } from "../graphql/useGov"
import useContractQuery from "../graphql/useContractQuery"
import { TooltipIcon } from "../components/Tooltip"
import FormGroup from "../components/FormGroup"
import { PollType } from "../pages/Poll/CreatePoll"
import useGovReceipt from "./receipts/useGovReceipt"
import useSelectAsset, { Config } from "./useSelectAsset"
import FormContainer from "./FormContainer"

enum Key {
  title = "title",
  description = "description",
  link = "link",

  /* Type.TEXT_WHITELIST */
  name = "name",
  ticker = "ticker",
  listed = "listed",
  suggestedOracle = "suggestedOracle",

  /* Type.WHITELIST */
  symbol = "symbol",
  reference = "reference",
  oracle = "oracle",
  weight = "weight",
  auctionDiscount = "auctionDiscount",
  minCollateralRatio = "minCollateralRatio",
  // Pre-IPO
  mintPeriod = "mintPeriod",
  minCollateralRatioAfterMigration = "minCollateralRatioAfterMigration",

  /* Type.MINT_UPDATE */
  asset = "asset",

  /* Type.GOV_UPDATE */
  owner = "owner",
  quorum = "quorum",
  threshold = "threshold",
  votingPeriod = "votingPeriod",
  effectiveDelay = "effectiveDelay",
  expirationPeriod = "expirationPeriod",
  proposalDeposit = "proposalDeposit",

  /* Type.COMMUNITY_SPEND */
  recipient = "recipient",
  amount = "amount",
}

const CreatePollForm = ({ type }: { type: PollType }) => {
  const balanceKey = BalanceKey.TOKEN
  const governance = useGov()
  const { config } = governance
  const communityPool = useCommunityPool()
  const spend_limit = communityPool.parsed?.spend_limit

  const getFieldKeys = () => {
    // Determine here which key to use for each type.
    // Filter out the validation and the fields to be printed on the screen based on this.

    const defaultKeys = [Key.title, Key.description, Key.link]
    const additionalKeys = {
      [PollType.TEXT]: defaultKeys,
      [PollType.TEXT_WHITELIST]: [
        Key.name,
        Key.ticker,
        Key.listed,
        Key.description,
        Key.link,
        Key.suggestedOracle,
      ],
      [PollType.TEXT_PREIPO]: [
        Key.name,
        Key.ticker,
        Key.listed,
        Key.description,
        Key.link,
        Key.suggestedOracle,
      ],
      [PollType.WHITELIST]: [
        ...defaultKeys,
        Key.name,
        Key.symbol,
        Key.reference,
        Key.oracle,
        Key.auctionDiscount,
        Key.minCollateralRatio,
        Key.mintPeriod,
        Key.minCollateralRatioAfterMigration,
      ],
      [PollType.INFLATION]: [...defaultKeys, Key.asset, Key.weight],
      [PollType.MINT_UPDATE]: [
        ...defaultKeys,
        Key.asset,
        Key.auctionDiscount,
        Key.minCollateralRatio,
      ],
      [PollType.GOV_UPDATE]: [
        ...defaultKeys,
        Key.quorum,
        Key.threshold,
        Key.votingPeriod,
        Key.effectiveDelay,
        Key.expirationPeriod,
        Key.proposalDeposit,
      ],
      [PollType.COMMUNITY_SPEND]: [...defaultKeys, Key.recipient, Key.amount],
    }

    return additionalKeys[type]
  }

  const combineTitle = ({ title, name, ticker }: Values<Key>) =>
    type === PollType.TEXT_WHITELIST
      ? `[Whitelist] ${name} (${ticker})`
      : type === PollType.TEXT_PREIPO
      ? `[Pre-IPO] ${name} (${ticker})`
      : title

  const combineDescription = ({ description, ...values }: Values<Key>) => {
    const { listed, suggestedOracle, reference } = values

    const combined = [
      description,
      listed && `Listed Exchange: ${listed}`,
      suggestedOracle && `Suggested Oracle: ${suggestedOracle}`,
      reference && `Reference Poll ID: ${reference}`,
    ]

    return combined.filter(Boolean).join("\n")
  }

  /* context */
  const { contracts, getToken } = useContractsAddress()
  const { result, find } = useContract()
  const getWeight = useDistributionInfo()
  useRefetch([balanceKey])

  /* form:validate */
  const validate = (values: Values<Key>) => {
    const { title, description, link } = values
    const { name, ticker, symbol, oracle, asset } = values
    const { weight, auctionDiscount, minCollateralRatio } = values
    const { mintPeriod, minCollateralRatioAfterMigration } = values
    const { owner, quorum, threshold, votingPeriod } = values
    const { effectiveDelay, expirationPeriod, proposalDeposit } = values
    const { recipient, amount } = values
    const { listed, reference } = values

    const paramRange = {
      optional: [PollType.MINT_UPDATE, PollType.GOV_UPDATE].includes(type),
      max: "100",
    }

    const textRanges = {
      [Key.title]: { min: 4, max: 64 },
      [Key.description]: { min: 4, max: 256 },
      [Key.link]: { min: 12, max: 128 },
      [Key.name]: { min: 3, max: 50 },
      [Key.ticker]: { min: 1, max: 11 },
      [Key.symbol]: { min: 3, max: 12 },
    }

    return record(
      {
        [Key.title]: [PollType.TEXT_WHITELIST, PollType.TEXT_PREIPO].includes(
          type
        )
          ? ""
          : v.required(title) ||
            v.length(title, textRanges[Key.title], "Title"),
        [Key.description]:
          v.required(description) ||
          v.length(description, textRanges[Key.description], "Description"),
        [Key.link]: !link
          ? ""
          : v.length(link, textRanges[Key.link], "Link") || v.url(link),

        // Type.TEXT_WHITELIST
        [Key.name]:
          v.required(name) || v.length(name, textRanges[Key.name], "Name"),
        [Key.ticker]:
          v.required(ticker) ||
          v.length(ticker, textRanges[Key.ticker], "Ticker") ||
          v.symbol(ticker),
        [Key.listed]: v.required(listed),
        [Key.suggestedOracle]: "",

        // Type.WHITELIST
        [Key.symbol]:
          v.required(symbol) ||
          v.length(symbol, textRanges[Key.symbol], "Symbol") ||
          v.symbol(symbol),
        [Key.reference]: !reference
          ? ""
          : v.integer(reference, "Reference Poll ID"),
        [Key.oracle]: v.address(oracle),

        // Type.MINT_UPDATE
        [Key.asset]: v.required(asset),

        [Key.weight]: v.amount(weight, {}, "Weight"),
        [Key.auctionDiscount]: v.amount(
          auctionDiscount,
          paramRange,
          "Auction discount"
        ),
        [Key.minCollateralRatio]: v.amount(
          minCollateralRatio,
          { ...paramRange, max: undefined },
          "Minimum collateral ratio"
        ),
        [Key.mintPeriod]: v.integer(mintPeriod, "Mint period"),
        [Key.minCollateralRatioAfterMigration]: v.amount(
          minCollateralRatioAfterMigration,
          { ...paramRange, max: undefined },
          "Min collateral ratio after migration"
        ),

        // Type.GOV_UPDATE
        [Key.owner]: !owner ? "" : v.address(owner),
        [Key.quorum]: !quorum ? "" : v.amount(quorum, paramRange, "Quorum"),
        [Key.threshold]: !threshold
          ? ""
          : v.amount(threshold, paramRange, "Threshold"),
        [Key.votingPeriod]: !votingPeriod
          ? ""
          : v.integer(votingPeriod, "Voting Period"),
        [Key.effectiveDelay]: !effectiveDelay
          ? ""
          : v.integer(effectiveDelay, "Effective Delay"),
        [Key.expirationPeriod]: !expirationPeriod
          ? ""
          : v.integer(expirationPeriod, "Expiration Period"),
        [Key.proposalDeposit]: !proposalDeposit
          ? ""
          : v.amount(proposalDeposit, { symbol: MIR }),

        // Type.COMMUNITY_SPEND
        [Key.recipient]: v.address(recipient),
        [Key.amount]: v.amount(amount, { symbol: MIR }),
      },
      "",
      getFieldKeys()
    )
  }

  /* form:hook */
  const initial = Object.assign(record(Key, ""))

  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form

  const title = combineTitle(values)
  const description = combineDescription(values)

  const { link } = values
  const { name, symbol, oracle, asset } = values
  const { weight, auctionDiscount, minCollateralRatio } = values
  const { mintPeriod, minCollateralRatioAfterMigration } = values
  const { owner, quorum, threshold, votingPeriod } = values
  const { effectiveDelay, expirationPeriod, proposalDeposit } = values
  const { recipient, amount } = values

  const deposit = config?.proposal_deposit ?? "0"
  const value = lookup(deposit, MIR)

  /* render:form */
  const selectAssetConfig: Config = {
    token: asset,
    onSelect: (value) => setValue(Key.asset, value),
    skip: ["MIR"],
  }

  const select = useSelectAsset(selectAssetConfig)

  const descriptionLabel = {
    [PollType.TEXT]: "Description",
    [PollType.TEXT_WHITELIST]: "Reason for listing",
    [PollType.TEXT_PREIPO]: "Reason for listing",
    [PollType.WHITELIST]: "Description",
    [PollType.INFLATION]: "Reason for modifying weight parameter",
    [PollType.MINT_UPDATE]: "Reason for modifying mint parameter",
    [PollType.GOV_UPDATE]: "Reason for modifying governance parameter",
    [PollType.COMMUNITY_SPEND]: "Reason for community pool spending",
  }[type]

  const weightPlaceholders = {
    [Key.weight]: div(getWeight(asset), 100),
  }

  const mintPlaceholders = {
    [Key.auctionDiscount]: "20",
    [Key.minCollateralRatio]: "150",
    [Key.mintPeriod]: "",
    [Key.minCollateralRatioAfterMigration]: "150",
  }

  const configPlaceholders = {
    [Key.owner]: config?.owner ?? "",
    [Key.quorum]: times(config?.quorum, 100),
    [Key.threshold]: times(config?.threshold, 100),
    [Key.votingPeriod]: config?.voting_period ?? "",
    [Key.effectiveDelay]: config?.effective_delay ?? "",
    [Key.expirationPeriod]: config?.expiration_period ?? "",
    [Key.proposalDeposit]: lookup(config?.proposal_deposit, MIR) ?? "",
  }

  const fields = {
    deposit: {
      help: renderBalance(find(balanceKey, getToken(MIR)), MIR),
      label: <TooltipIcon content={Tooltip.Gov.Deposit}>Deposit</TooltipIcon>,
      value,
      unit: MIR,
    },

    ...getFields({
      [Key.title]: {
        label: "Title",
        input: { placeholder: "", autoFocus: true },
      },
      [Key.description]: {
        label: descriptionLabel,
        textarea: { placeholder: "" },
      },
      [Key.link]: {
        label: "Information Link (Optional)",
        input: {
          placeholder: [
            PollType.TEXT_WHITELIST,
            PollType.TEXT_PREIPO,
            PollType.WHITELIST,
          ].includes(type)
            ? "URL for additional asset information (Bloomberg, Investing.com, Yahoo Finance, etc.)"
            : "URL for additional information",
        },
      },

      // Type.TEXT_WHITELIST
      [Key.name]: {
        label: "Asset Name",
        input: {
          placeholder: "Apple Inc.",
          autoFocus: [PollType.TEXT_WHITELIST, PollType.TEXT_PREIPO].includes(
            type
          ),
        },
      },
      [Key.ticker]: {
        label: <TooltipIcon content={Tooltip.Gov.Ticker}>Ticker</TooltipIcon>,
        input: { placeholder: "AAPL" },
      },
      [Key.listed]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.ListedExchange}>
            Listed Exchange
          </TooltipIcon>
        ),
        input: { placeholder: "NASDAQ" },
      },
      [Key.suggestedOracle]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.SuggestedOracle}>
            Suggested Oracle (Optional)
          </TooltipIcon>
        ),
        input: { placeholder: "Band Protocol" },
      },

      // Type.WHITELIST
      [Key.symbol]: {
        label: "Symbol",
        input: { placeholder: "mAAPL" },
      },
      [Key.oracle]: {
        label: "Oracle Feeder",
        input: { placeholder: "Terra address of the oracle feeder" },
      },
      [Key.reference]: {
        label: "Reference Poll ID (Optional)",
        input: { placeholder: "" },
      },

      // Type.INFLATION
      [Key.weight]: {
        label: <TooltipIcon content={Tooltip.Gov.Weight}>Weight</TooltipIcon>,
        input: {
          type: "number",
          step: step(),
          placeholder: weightPlaceholders[Key.weight],
        },
      },

      // Type.MINT_UPDATE
      [Key.asset]: {
        label: "Asset",
        select: select.button,
        assets: select.assets,
        focused: select.isOpen,
      },
      [Key.auctionDiscount]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.AuctionDiscount}>
            Auction Discount
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: mintPlaceholders[Key.auctionDiscount],
        },
        unit: "%",
      },
      [Key.minCollateralRatio]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.MinimumCollateralRatio}>
            Minimum Collateral Ratio
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: mintPlaceholders[Key.minCollateralRatio],
        },
        unit: "%",
      },
      [Key.mintPeriod]: {
        label: "Mint Period (Pre-IPO)",
        input: { placeholder: mintPlaceholders[Key.mintPeriod] },
      },
      [Key.minCollateralRatioAfterMigration]: {
        label: "Minimum collateral ratio after migration (Pre-IPO)",
        input: {
          type: "number",
          step: step(),
          placeholder: mintPlaceholders[Key.minCollateralRatioAfterMigration],
        },
        unit: "%",
      },

      // Type.GOV_UPDATE
      [Key.owner]: {
        label: "Owner (Optional)",
        input: { placeholder: configPlaceholders[Key.owner] },
      },
      [Key.quorum]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.Quorum}>
            Quorum (Optional)
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: configPlaceholders[Key.quorum],
        },
        unit: "%",
      },
      [Key.threshold]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.Threshold}>
            Threshold (Optional)
          </TooltipIcon>
        ),
        input: {
          type: "number",
          step: step(),
          placeholder: configPlaceholders[Key.threshold],
        },
        unit: "%",
      },
      [Key.votingPeriod]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.VotingPeriod}>
            Voting Period (Optional)
          </TooltipIcon>
        ),
        input: { placeholder: configPlaceholders[Key.votingPeriod] },
        unit: "Block(s)",
      },
      [Key.effectiveDelay]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.EffectiveDelay}>
            Effective Delay (Optional)
          </TooltipIcon>
        ),
        input: { placeholder: configPlaceholders[Key.effectiveDelay] },
        unit: "Block(s)",
      },
      [Key.expirationPeriod]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.ExpirationPeriod}>
            Expiration Period (Optional)
          </TooltipIcon>
        ),
        input: { placeholder: configPlaceholders[Key.expirationPeriod] },
        unit: "Block(s)",
      },
      [Key.proposalDeposit]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.ProposalDeposit}>
            Proposal Deposit (Optional)
          </TooltipIcon>
        ),
        input: { placeholder: configPlaceholders[Key.proposalDeposit] },
        unit: MIR,
      },

      // Type.COMMUNITY_SPEND
      [Key.recipient]: {
        label: (
          <TooltipIcon content={Tooltip.Gov.Recipient}>Recipient</TooltipIcon>
        ),
        input: { placeholder: "Terra address" },
      },
      [Key.amount]: {
        label: <TooltipIcon content={Tooltip.Gov.Amount}>Amount</TooltipIcon>,
        input: { placeholder: placeholder(MIR) },
        help: renderBalance(spend_limit, MIR),
        unit: MIR,
      },
    }),
  }

  /* submit */
  const newContractMsg = useNewContractMsg()
  const token = asset
  const { mirrorToken, mint, gov, factory, community } = contracts

  /* Type.WHITELIST */
  const whitelistMessage = {
    name,
    symbol,
    oracle_feeder: oracle,
    params: {
      auction_discount: div(auctionDiscount, 100),
      min_collateral_ratio: div(minCollateralRatio, 100),
      mint_period: mintPeriod || undefined,
      min_collateral_ratio_after_migration: minCollateralRatioAfterMigration
        ? div(minCollateralRatioAfterMigration, 100)
        : undefined,
    },
  }

  /* Type.INFLATION */
  const updateWeight = {
    asset_token: token,
    weight: !weight ? undefined : number(times(weight, 100)),
  }

  /* Type.MINT_UPDATE */
  const mintPassCommand = {
    contract_addr: mint,
    msg: toBase64({
      update_asset: {
        asset_token: token,
        auction_discount: auctionDiscount
          ? div(auctionDiscount, 100)
          : undefined,
        min_collateral_ratio: minCollateralRatio
          ? div(minCollateralRatio, 100)
          : undefined,
      },
    }),
  }

  /* Type.GOV_UPDATE */
  const govUpdateConfig = {
    owner,
    quorum: quorum ? div(quorum, 100) : undefined,
    threshold: threshold ? div(threshold, 100) : undefined,
    voting_period: votingPeriod ? Number(votingPeriod) : undefined,
    effective_delay: effectiveDelay ? Number(effectiveDelay) : undefined,
    expiration_period: expirationPeriod ? Number(expirationPeriod) : undefined,
    proposal_deposit: proposalDeposit ? toAmount(proposalDeposit) : undefined,
  }

  /* Type.COMMUNITY_SPEND */
  const communitySpend = {
    recipient,
    amount: toAmount(amount),
  }

  const execute_msg = {
    [PollType.TEXT]: undefined,
    [PollType.TEXT_WHITELIST]: undefined,
    [PollType.TEXT_PREIPO]: undefined,
    [PollType.WHITELIST]: {
      contract: factory,
      msg: toBase64({ whitelist: whitelistMessage }),
    },
    [PollType.INFLATION]: {
      contract: factory,
      msg: toBase64({ update_weight: updateWeight }),
    },
    [PollType.MINT_UPDATE]: {
      contract: factory,
      msg: toBase64({ pass_command: mintPassCommand }),
    },
    [PollType.GOV_UPDATE]: {
      contract: gov,
      msg: toBase64({ update_config: govUpdateConfig }),
    },
    [PollType.COMMUNITY_SPEND]: {
      contract: community,
      msg: toBase64({ spend: communitySpend }),
    },
  }[type]

  const msg = toBase64({
    create_poll: { title, description, link, execute_msg },
  })

  const data = [
    newContractMsg(mirrorToken, {
      send: { amount: deposit, contract: gov, msg },
    }),
  ]

  const loading =
    result[balanceKey].loading || governance.result[GovKey.CONFIG].loading

  const messages =
    !loading && !gte(find(balanceKey, getToken(MIR)), deposit)
      ? ["Insufficient balance"]
      : getLength(msg) > MAX_MSG_LENGTH
      ? ["Input is too long to be executed"]
      : type === PollType.GOV_UPDATE &&
        Object.values(govUpdateConfig).filter(Boolean).length > 1
      ? ["Only one governance parameter can be modified at a time."]
      : undefined

  const disabled = invalid || loading || !!messages?.length

  /* result */
  const label = "Submit"
  const parseTx = useGovReceipt()
  const fieldKeys = getFieldKeys()
  const container = { attrs, contents: [], messages, label, disabled, data }

  return (
    <FormContainer {...container} parseTx={parseTx} gov>
      {fieldKeys.map(
        (key) =>
          !fields[key].input?.disabled && (
            <FormGroup {...fields[key]} type={2} key={key} />
          )
      )}

      <FormGroup {...fields["deposit"]} type={2} />
    </FormContainer>
  )
}

export default CreatePollForm

/* community pool */
const useCommunityPool = () => {
  const { contracts } = useContractsAddress()
  const variables = { contract: contracts["community"], msg: { config: {} } }
  const query = useContractQuery<{ spend_limit: string }>(
    variables,
    "CommunityPool"
  )

  return query
}

const useDistributionInfo = () => {
  const { contracts } = useContractsAddress()
  const params = {
    contract: contracts["factory"],
    msg: { distribution_info: {} },
  }

  const { parsed } = useContractQuery<{ weights: [string, number][] }>(
    params,
    "DistributionInfo"
  )

  return (token: string) =>
    parsed?.weights.find(([addr]) => addr === token)?.[1]
}
