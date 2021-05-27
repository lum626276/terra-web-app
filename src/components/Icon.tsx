import { ReactComponent as ArrowDown } from "../icons/ArrowDown.svg"
import { ReactComponent as ArrowRightCircleSolid } from "../icons/ArrowRightCircleSolid.svg"
import { ReactComponent as Chart } from "../icons/Chart.svg"
import { ReactComponent as Chat } from "../icons/Chat.svg"
import { ReactComponent as Check } from "../icons/Check.svg"
import { ReactComponent as ChevronDown } from "../icons/ChevronDown.svg"
import { ReactComponent as ChevronDownThin } from "../icons/ChevronDownThin.svg"
import { ReactComponent as ChevronRight } from "../icons/ChevronRight.svg"
import { ReactComponent as ChevronUp } from "../icons/ChevronUp.svg"
import { ReactComponent as ChevronUpThin } from "../icons/ChevronUpThin.svg"
import { ReactComponent as Claim } from "../icons/Claim.svg"
import { ReactComponent as Clock } from "../icons/Clock.svg"
import { ReactComponent as Close } from "../icons/Close.svg"
import { ReactComponent as CloseCircleSolid } from "../icons/CloseCircleSolid.svg"
import { ReactComponent as CloseCircleSolidBlue } from "../icons/CloseCircleSolidBlue.svg"
import { ReactComponent as Completed } from "../icons/Completed.svg"
import { ReactComponent as Desktop } from "../icons/Desktop.svg"
import { ReactComponent as Discord } from "../icons/Discord.svg"
import { ReactComponent as Docs } from "../icons/Docs.svg"
import { ReactComponent as DownSolid } from "../icons/DownSolid.svg"
import { ReactComponent as Download } from "../icons/Download.svg"
import { ReactComponent as ExclamationCircle } from "../icons/ExclamationCircle.svg"
import { ReactComponent as ExclamationCircleSolid } from "../icons/ExclamationCircleSolid.svg"
import { ReactComponent as ExclamationTriangleSolid } from "../icons/ExclamationTriangleSolid.svg"
import { ReactComponent as External } from "../icons/External.svg"
import { ReactComponent as Farm } from "../icons/Farm.svg"
import { ReactComponent as Github } from "../icons/Github.svg"
import { ReactComponent as Governance } from "../icons/Governance.svg"
import { ReactComponent as GridViewSolid } from "../icons/GridViewSolid.svg"
import { ReactComponent as InfoCircle } from "../icons/InfoCircle.svg"
import { ReactComponent as ListView } from "../icons/ListView.svg"
import { ReactComponent as Market } from "../icons/Market.svg"
import { ReactComponent as Medium } from "../icons/Medium.svg"
import { ReactComponent as Mirror } from "../icons/Mirror.svg"
import { ReactComponent as Mobile } from "../icons/Mobile.svg"
import { ReactComponent as Mode } from "../icons/Mode.svg"
import { ReactComponent as MoreCircle } from "../icons/MoreCircle.svg"
import { ReactComponent as Plus } from "../icons/Plus.svg"
import { ReactComponent as Poll } from "../icons/Poll.svg"
import { ReactComponent as PollSolid } from "../icons/PollSolid.svg"
import { ReactComponent as Search } from "../icons/Search.svg"
import { ReactComponent as Send } from "../icons/Send.svg"
import { ReactComponent as Settings } from "../icons/Settings.svg"
import { ReactComponent as Telegram } from "../icons/Telegram.svg"
import { ReactComponent as Twitter } from "../icons/Twitter.svg"
import { ReactComponent as UpSolid } from "../icons/UpSolid.svg"
import { ReactComponent as VerifiedSolid } from "../icons/VerifiedSolid.svg"
import { ReactComponent as Wallet } from "../icons/Wallet.svg"

interface Props {
  name: IconNames
  size?: number
  className?: string
}

const Icon = ({ name, size = 16, className }: Props) => {
  const props = { width: size, height: size, className }

  return {
    ArrowDown: <ArrowDown {...props} />,
    ArrowRightCircleSolid: <ArrowRightCircleSolid {...props} />,
    Chart: <Chart {...props} />,
    Chat: <Chat {...props} />,
    Check: <Check {...props} />,
    ChevronDown: <ChevronDown {...props} />,
    ChevronDownThin: <ChevronDownThin {...props} />,
    ChevronRight: <ChevronRight {...props} />,
    ChevronUp: <ChevronUp {...props} />,
    ChevronUpThin: <ChevronUpThin {...props} />,
    Claim: <Claim {...props} />,
    Clock: <Clock {...props} />,
    Close: <Close {...props} />,
    CloseCircleSolid: <CloseCircleSolid {...props} />,
    CloseCircleSolidBlue: <CloseCircleSolidBlue {...props} />,
    Completed: <Completed {...props} />,
    Desktop: <Desktop {...props} />,
    Discord: <Discord {...props} />,
    Docs: <Docs {...props} />,
    DownSolid: <DownSolid {...props} />,
    Download: <Download {...props} />,
    ExclamationCircle: <ExclamationCircle {...props} />,
    ExclamationCircleSolid: <ExclamationCircleSolid {...props} />,
    ExclamationTriangleSolid: <ExclamationTriangleSolid {...props} />,
    External: <External {...props} />,
    Farm: <Farm {...props} />,
    Github: <Github {...props} />,
    Governance: <Governance {...props} />,
    GridViewSolid: <GridViewSolid {...props} />,
    InfoCircle: <InfoCircle {...props} />,
    ListView: <ListView {...props} />,
    Market: <Market {...props} />,
    Medium: <Medium {...props} />,
    Mirror: <Mirror {...props} />,
    Mobile: <Mobile {...props} />,
    Mode: <Mode {...props} />,
    MoreCircle: <MoreCircle {...props} />,
    Plus: <Plus {...props} />,
    Poll: <Poll {...props} />,
    PollSolid: <PollSolid {...props} />,
    Search: <Search {...props} />,
    Send: <Send {...props} />,
    Settings: <Settings {...props} />,
    Telegram: <Telegram {...props} />,
    Twitter: <Twitter {...props} />,
    UpSolid: <UpSolid {...props} />,
    VerifiedSolid: <VerifiedSolid {...props} />,
    Wallet: <Wallet {...props} />,
  }[name]
}

export default Icon
