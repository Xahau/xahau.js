import { ValidationError } from '../../errors'

import { BaseTransaction, validateBaseTransaction } from './common'
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
 * ClaimReward is a transaction model that allows an account to claim rewards.
 *
 * @category Transaction Models
 */
export interface ClaimReward extends BaseTransaction {
  TransactionType: 'ClaimReward'
  Flags?: number | ClaimRewardFlags
  /** The unique address of the issuer where the reward.c hook is installed. */
  Issuer?: string
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
