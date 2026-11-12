import { SignerEntry } from '../common'
import { ExportedTxn as ExportedTxnTransaction } from '../transactions/export'

import { BaseLedgerEntry } from './BaseLedgerEntry'

/**
 * An export in its signing window (Export amendment): a transaction for
 * another network that the UNL's export keys are multisigning on behalf of
 * `Owner`. It is deleted when the window closes, once signed at quorum or not.
 *
 * @category Ledger Entries
 */
export default interface ExportedTxn extends BaseLedgerEntry {
  LedgerEntryType: 'ExportedTxn'
  /** The exporting account. */
  Owner: string
  /** The network the inner transaction is for. */
  RemoteNetworkID: number
  /** The inner transaction for the other network. */
  ExportedTxn: ExportedTxnTransaction
  /** The id of the inner transaction on the other network, without signatures. */
  TransactionHash: string
  /** The ledger index in which the export was created. */
  LedgerSequence: number
  /** The signers that may sign the inner transaction. */
  SignerEntries: SignerEntry[]
  /** The signer weight that the signatures must reach. */
  SignerQuorum: number
  /** The hash of the Hook that made the export, which is called back if it closes below quorum. */
  EmitHookHash?: string
  /** The id of the Export transaction that created this entry. */
  ExportTxnID?: string
}
