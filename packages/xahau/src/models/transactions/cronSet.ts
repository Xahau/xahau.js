import { ValidationError } from '../../errors'

import {
  BaseTransaction,
  GlobalFlags,
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
 * Map of flags to boolean values representing {@link CronSet} transaction
 * flags.
 *
 * @category Transaction Flags
 *
 * @example
 * ```typescript
 * const tx: CronSet = {
 * Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
 * TransactionType: 'CronSet',
 * Flags: {
 *   tfCronUnset: true,
 * },
 * }
 *
 * // Autofill the tx to see how flags actually look compared to the interface usage.
 * const autofilledTx = await client.autofill(tx)
 * console.log(autofilledTx)
 * // {
 * // Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
 * // TransactionType: 'CronSet',
 * // Flags: 0,
 * // Sequence: 21970384,
 * // Fee: '12',
 * // LastLedgerSequence: 21970404
 * // }
 * ```
 */
export interface CronSetFlagsInterface extends GlobalFlags {
  tfCronUnset?: boolean
}

/**
 * CronSet is a transaction model that allows an account to set a cron job.
 *
 * @category Transaction Models
 */
export interface CronSet extends BaseTransaction {
  TransactionType: 'CronSet'
  Flags?: number | CronSetFlagsInterface
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
