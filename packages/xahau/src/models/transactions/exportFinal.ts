import { BaseTransaction } from './common'

/**
 * Pseudo-transaction that closes an export (Export amendment). Without
 * `LedgerIndex` it closes the signing window of the export created in ledger
 * `LedgerSequence` with unsigned id `TransactionHash`. With it, it expires an
 * export that was signed and sent but never came back.
 *
 * @category Pseudo Transaction Models
 */
export interface ExportFinal extends BaseTransaction {
  TransactionType: 'ExportFinal'
  /** The account that made the export. */
  Owner: string
  /**
   * Without `LedgerIndex`, the ledger index in which the export was created.
   * With it, the export's `LastLedgerSequence` on the other network, which
   * the ledger proven for that network has passed.
   */
  LedgerSequence: number
  /** The id, without signatures, of the export. */
  TransactionHash: string
  /** The export's ShadowTicket. Present only when expiring a sent export. */
  LedgerIndex?: string
}
