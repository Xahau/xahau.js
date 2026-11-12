import { BaseTransaction } from './common'

/**
 * A transaction for another network, built by the exporting account's hook
 * and multisigned by the UNL's export keys. The set of exportable transaction
 * types is gated by amendments on the ledger, so it is not enumerated here.
 *
 * @category Transaction Models
 */
export interface ExportedTxn {
  [field: string]: unknown
  TransactionType: string
  Account: string
}

/**
 * An Export transaction asks the UNL's export keys to multisign
 * `ExportedTxn`, a transaction for another network from the account's own
 * signer list there (Export amendment). It is emitted by a Hook through
 * `xport()` and is never submitted by users.
 *
 * @category Transaction Models
 */
export interface Export extends BaseTransaction {
  TransactionType: 'Export'
  /** The transaction for another network that is to be multisigned. */
  ExportedTxn: ExportedTxn
}
