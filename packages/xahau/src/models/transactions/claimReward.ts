import { ValidationError } from '../../errors'
import { Currency } from '../common'

import { BaseTransaction, GlobalFlags, validateBaseTransaction } from './common'
/**
 * Transaction Flags for an ClaimReward Transaction.
 *
 * @category Transaction Flags
 */
export enum ClaimRewardFlags {
  /**
   * If set, indicates that the user would like to opt out of rewards.
   */
  tfOptOut = 0x00000001,
}

/**
 * Map of flags to boolean values representing {@link ClaimReward} transaction
 * flags.
 *
 * @category Transaction Flags
 *
 * @example
 * ```typescript
 * const tx: ClaimReward = {
 * Account: 'rhFcpWDHLqpBmX4ezWiA5VLSS4e1BHqhHd',
 * TransactionType: 'ClaimReward',
 * Flags: {
 *   tfOptOut: true,
 *  },
 * }
 *
 * // Autofill the tx to see how flags actually look compared to the interface usage.
 * const autofilledTx = await client.autofill(tx)
 * console.log(autofilledTx)
 * // {
 * // Account: 'rhFcpWDHLqpBmX4ezWiA5VLSS4e1BHqhHd',
 * // TransactionType: 'ClaimReward',
 * // Flags: 0,
 * // Sequence: 21970384,
 * // Fee: '12',
 * // LastLedgerSequence: 21970404
 * // }
 * ```
 */
export interface ClaimRewardFlagsInterface extends GlobalFlags {
  tfOptOut?: boolean
}

/**
 * ClaimReward is a transaction model that allows an account to claim rewards.
 *
 * @category Transaction Models
 */
export interface ClaimReward extends BaseTransaction {
  TransactionType: 'ClaimReward'
  Flags?: number | ClaimRewardFlagsInterface
  /** The unique address of the issuer where the reward.c hook is installed. */
  Issuer?: string
  ClaimCurrency?: Currency
}

/**
 * Verify the form and type of an ClaimReward at runtime.
 *
 * @param tx - An ClaimReward Transaction.
 * @throws When the ClaimReward is Malformed.
 */
export function validateClaimReward(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  if (tx.Issuer !== undefined && typeof tx.Issuer !== 'string') {
    throw new ValidationError('ClaimReward: Issuer must be a string')
  }

  if (tx.Account === tx.Issuer) {
    throw new ValidationError(
      'ClaimReward: Account and Issuer cannot be the same',
    )
  }
}
