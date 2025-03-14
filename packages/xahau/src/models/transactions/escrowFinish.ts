import { ValidationError } from '../../errors'

import {
  Account,
  BaseTransaction,
  isAccount,
  validateBaseTransaction,
  validateRequiredField,
} from './common'

/**
 * Deliver amount from a held payment to the recipient.
 *
 * @category Transaction Models
 */
export interface EscrowFinish extends BaseTransaction {
  TransactionType: 'EscrowFinish'
  /** Address of the source account that funded the held payment. */
  Owner: Account
  /**
   * Transaction sequence of EscrowCreate transaction that created the held.
   * payment to finish.
   */
  OfferSequence: number | string
  /**
   * The ID of the Escrow ledger object to cancel as a 64-character hexadecimal
   * string.
   */
  EscrowID?: string
  /**
   * Hex value matching the previously-supplied PREIMAGE-SHA-256.
   * crypto-condition of the held payment.
   */
  Condition?: string
  /**
   * Hex value of the PREIMAGE-SHA-256 crypto-condition fulfillment matching.
   * the held payment's Condition.
   */
  Fulfillment?: string
}

/**
 * Verify the form and type of an EscrowFinish at runtime.
 *
 * @param tx - An EscrowFinish Transaction.
 * @throws When the EscrowFinish is Malformed.
 */
export function validateEscrowFinish(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  validateRequiredField(tx, 'Owner', isAccount)

  if (tx.OfferSequence === undefined && tx.EscrowID === undefined) {
    throw new ValidationError(
      'EscrowFinish: must include OfferSequence or EscrowID',
    )
  }

  if (tx.OfferSequence !== undefined && typeof tx.OfferSequence !== 'number') {
    throw new ValidationError('EscrowFinish: OfferSequence must be a number')
  }

  if (tx.EscrowID !== undefined && typeof tx.EscrowID !== 'string') {
    throw new ValidationError('EscrowFinish: EscrowID must be a string')
  }

  if (tx.Condition !== undefined && typeof tx.Condition !== 'string') {
    throw new ValidationError('EscrowFinish: Condition must be a string')
  }

  if (tx.Fulfillment !== undefined && typeof tx.Fulfillment !== 'string') {
    throw new ValidationError('EscrowFinish: Fulfillment must be a string')
  }
}
