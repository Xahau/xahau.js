import { Account } from '../transactions/common'

import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

/**
 * The EmittedTxn object type contains the
 *
 * @category Ledger Entries
 */
export default interface Cron extends BaseLedgerEntry, HasPreviousTxnID {
  LedgerEntryType: 'Cron'
  /** The owner of the cron job. */
  Owner: Account
  /** The start time of the cron job. */
  StartTime: number
  /** The delay seconds of the cron job. */
  DelaySeconds: number
  /** The repeat count of the cron job. */
  RepeatCount: number
  /**
   * A hint indicating which page of the sender's owner directory links to this
   * object, in case the directory consists of multiple pages.
   */
  OwnerNode: string
}
