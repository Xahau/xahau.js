import { BaseTransaction } from './common'
import { ExportedTxn } from './export'

/**
 * Pseudo-transaction that exports `ExportedTxn` on behalf of `Owner`, an
 * exporter on the network the inner transaction's `NetworkID` names
 * (Export amendment). These are the ledger's own TicketCreates and
 * SignerListSets, which keep an exporter's tickets and signer list there in
 * step. The owner pays for it, like an Export.
 *
 * @category Pseudo Transaction Models
 */
export interface ExportAuto extends BaseTransaction {
  TransactionType: 'ExportAuto'
  /** The exporting account. */
  Owner: string
  /**
   * The ledger index where this pseudo-transaction appears.
   * This distinguishes the pseudo-transaction from other occurrences of the same change.
   */
  LedgerSequence: number
  /** The transaction for another network to export. */
  ExportedTxn: ExportedTxn
}
