import AccountRoot from './AccountRoot'
import Amendments from './Amendments'
import Check from './Check'
import DepositPreauth from './DepositPreauth'
import DirectoryNode from './DirectoryNode'
import EmittedTxn from './EmittedTxn'
import Escrow from './Escrow'
import FeeSettings from './FeeSettings'
import Hook from './Hook'
import HookDefinition from './HookDefinition'
import HookState from './HookState'
import ImportVLSequence from './ImportVLSequence'
import LedgerHashes from './LedgerHashes'
import NegativeUNL from './NegativeUNL'
import Offer from './Offer'
import PayChannel from './PayChannel'
import RippleState from './RippleState'
import SignerList from './SignerList'
import Ticket from './Ticket'
import UNLReport from './UNLReport'
import URIToken from './URIToken'

type LedgerEntry =
  | AccountRoot
  | Amendments
  | Check
  | DepositPreauth
  | DirectoryNode
  | EmittedTxn
  | Escrow
  | FeeSettings
  | Hook
  | HookDefinition
  | HookState
  | ImportVLSequence
  | LedgerHashes
  | NegativeUNL
  | Offer
  | PayChannel
  | RippleState
  | SignerList
  | Ticket
  | UNLReport
  | URIToken

type LedgerEntryFilter =
  | 'account'
  | 'amendments'
  | 'check'
  | 'deposit_preauth'
  | 'directory'
  | 'escrow'
  | 'fee'
  | 'hook'
  | 'hook_state'
  | 'hook_definition'
  | 'import_vl_sequence'
  | 'hashes'
  | 'offer'
  | 'payment_channel'
  | 'signer_list'
  | 'state'
  | 'ticket'
  | 'unl_report'
  | 'uri_token'

export { LedgerEntry, LedgerEntryFilter }
