import AccountRoot from './AccountRoot'
import Amendments from './Amendments'
import AMM from './AMM'
import Bridge from './Bridge'
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
import Oracle from './Oracle'
import PayChannel from './PayChannel'
import RippleState from './RippleState'
import SignerList from './SignerList'
import Ticket from './Ticket'
import UNLReport from './UNLReport'
import URIToken from './URIToken'
import XChainOwnedClaimID from './XChainOwnedClaimID'
import XChainOwnedCreateAccountClaimID from './XChainOwnedCreateAccountClaimID'

type LedgerEntry =
  | AccountRoot
  | Amendments
  | AMM
  | Bridge
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
  | Oracle
  | PayChannel
  | RippleState
  | SignerList
  | Ticket
  | UNLReport
  | URIToken
  | XChainOwnedClaimID
  | XChainOwnedCreateAccountClaimID

type LedgerEntryFilter =
  | 'account'
  | 'amendments'
  | 'amm'
  | 'bridge'
  | 'check'
  | 'deposit_preauth'
  | 'did'
  | 'directory'
  | 'escrow'
  | 'emitted_txn'
  | 'hook'
  | 'hook_definition'
  | 'hook_state'
  | 'fee'
  | 'hashes'
  | 'import_vlseq'
  | 'nft_offer'
  | 'nft_page'
  | 'offer'
  | 'oracle'
  | 'payment_channel'
  | 'uri_token'
  | 'signer_list'
  | 'state'
  | 'ticket'
  | 'unl_report'
  | 'xchain_owned_create_account_claim_id'
  | 'xchain_owned_claim_id'

export { LedgerEntry, LedgerEntryFilter }
