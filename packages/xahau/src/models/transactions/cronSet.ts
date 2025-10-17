import { ValidationError } from '../../errors'

import { BaseTransaction, validateBaseTransaction } from './common'
/**
 * Transaction Flags for an CronSet Transaction.
 *
 * @category Transaction Flags
 */
export enum CronSetFlags {
  /**
   * If set, indicates that the user would like to unset the cron job.
   */
  tfCronUnset = 0x00000001,
}

/**
 * CronSet is a transaction model that allows an account to set a cron job.
 *
 * @category Transaction Models
 */
export interface CronSet extends BaseTransaction {
  TransactionType: 'CronSet'
  Flags?: number | CronSetFlags
  RepeatCount?: number
  DelaySeconds?: number
}

const MAX_REPEAT_COUNT = 256
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- seconds in a year
const MIN_DELAY_SECONDS = 365 * 24 * 60 * 60

/**
 * Verify the form and type of an CronSet at runtime.
 *
 * @param tx - An CronSet Transaction.
 * @throws When the CronSet is Malformed.
 */
export function validateCronSet(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  if (tx.Flags === CronSetFlags.tfCronUnset) {
    if (tx.RepeatCount !== undefined || tx.DelaySeconds !== undefined) {
      throw new ValidationError(
        'CronSet: RepeatCount and DelaySeconds must not be set when Flags is set to tfCronUnset',
      )
    }
  }

  if (tx.RepeatCount !== undefined && typeof tx.RepeatCount !== 'number') {
    throw new ValidationError('CronSet: RepeatCount must be a number')
  }

  if (tx.RepeatCount !== undefined && tx.RepeatCount > MAX_REPEAT_COUNT) {
    throw new ValidationError(
      `CronSet: RepeatCount must be less than ${MAX_REPEAT_COUNT}`,
    )
  }

  if (tx.DelaySeconds !== undefined && typeof tx.DelaySeconds !== 'number') {
    throw new ValidationError('CronSet: DelaySeconds must be a number')
  }

  if (tx.DelaySeconds !== undefined && tx.DelaySeconds > MIN_DELAY_SECONDS) {
    throw new ValidationError(
      `CronSet: DelaySeconds must be less than ${MIN_DELAY_SECONDS}`,
    )
  }
}
