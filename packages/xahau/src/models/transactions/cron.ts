import { BaseTransaction } from './common'

/**
 * Cron job to be executed.
 *
 * @category Pseudo Transaction Models
 */
export interface Cron extends BaseTransaction {
  TransactionType: 'Cron'
  /**
   * The ledger index where this pseudo-transaction appears.
   * This distinguishes the pseudo-transaction from other occurrences of the same change.
   */
  LedgerSequence: number
  /** The owner of the cron job. */
  Owner: string
}
