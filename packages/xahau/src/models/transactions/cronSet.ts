import { ValidationError } from '../../errors'

import {
  BaseTransaction,
  isNumber,
  validateBaseTransaction,
  validateOptionalField,
  validateRequiredField,
} from './common'
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
  StartTime?: number
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

  if (
    typeof tx.Flags === 'number' &&
    // eslint-disable-next-line no-bitwise -- bitwise operation to check if the flag is set
    tx.Flags & CronSetFlags.tfCronUnset
  ) {
    if (
      tx.RepeatCount !== undefined ||
      tx.DelaySeconds !== undefined ||
      tx.StartTime !== undefined
    ) {
      throw new ValidationError(
        'CronSet: RepeatCount, DelaySeconds, and StartTime must not be set when Flags is set to tfCronUnset',
      )
    }
    return
  }
  // eslint-disable-next-line no-bitwise -- bitwise operation to check if the flag is set
  console.log(tx.Flags, CronSetFlags.tfCronUnset, 1 & 1)

  validateRequiredField(tx, 'StartTime', isNumber)
  validateOptionalField(tx, 'RepeatCount', isNumber)
  validateOptionalField(tx, 'DelaySeconds', isNumber)

  if ((tx.RepeatCount === undefined) !== (tx.DelaySeconds === undefined)) {
    throw new ValidationError(
      'CronSet: Both RepeatCount and DelaySeconds must be set, or neither should be set',
    )
  }

  if (typeof tx.RepeatCount === 'number' && tx.RepeatCount > MAX_REPEAT_COUNT) {
    throw new ValidationError(
      `CronSet: RepeatCount must be less than ${MAX_REPEAT_COUNT}`,
    )
  }

  if (
    typeof tx.DelaySeconds === 'number' &&
    tx.DelaySeconds > MIN_DELAY_SECONDS
  ) {
    throw new ValidationError(
      `CronSet: DelaySeconds must be less than ${MIN_DELAY_SECONDS}`,
    )
  }
}
