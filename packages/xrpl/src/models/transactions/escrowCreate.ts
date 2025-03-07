/* eslint-disable complexity -- Necessary for validateEscrowCreate */
import { ValidationError } from '../../errors'
import { Amount } from '../common'

import { BaseTransaction, isAmount, validateBaseTransaction } from './common'

/**
 * Sequester amount until the escrow process either finishes or is canceled.
 *
 * @category Transaction Models
 */
export interface EscrowCreate extends BaseTransaction {
  TransactionType: 'EscrowCreate'
  /**
   * Amount to deduct from the sender's balance and escrow. Once escrowed, the
   * amount can either go to the Destination address (after the FinishAfter time)
   * or returned to the sender (after the CancelAfter time).
   */
  Amount: Amount
  /** Address to receive escrowed amount. */
  Destination: string
  /**
   * The time, in seconds since the Ripple Epoch, when this escrow expires.
   * This value is immutable; the funds can only be returned the sender after.
   * this time.
   */
  CancelAfter?: number
  /**
   * The time, in seconds since the Ripple Epoch, when the escrowed amount can be
   * released to the recipient. This value is immutable; the funds cannot move.
   * until this time is reached.
   */
  FinishAfter?: number
  /**
   * Hex value representing a PREIMAGE-SHA-256 crypto-condition . The funds can.
   * only be delivered to the recipient if this condition is fulfilled.
   */
  Condition?: string
  /**
   * Arbitrary tag to further specify the destination for this escrowed.
   * payment, such as a hosted recipient at the destination address.
   */
  DestinationTag?: number
}

/**
 * Verify the form and type of an EscrowCreate at runtime.
 *
 * @param tx - An EscrowCreate Transaction.
 * @throws When the EscrowCreate is Malformed.
 */
export function validateEscrowCreate(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  if (tx.Amount === undefined) {
    throw new ValidationError('EscrowCreate: missing field Amount')
  }

  if (typeof tx.Amount !== 'string' && !isAmount(tx.Amount)) {
    throw new ValidationError('EscrowCreate: Amount must be an Amount')
  }

  if (tx.Destination === undefined) {
    throw new ValidationError('EscrowCreate: missing field Destination')
  }

  if (typeof tx.Destination !== 'string') {
    throw new ValidationError('EscrowCreate: Destination must be a string')
  }

  if (tx.CancelAfter === undefined && tx.FinishAfter === undefined) {
    throw new ValidationError(
      'EscrowCreate: Either CancelAfter or FinishAfter must be specified',
    )
  }

  if (tx.FinishAfter === undefined && tx.Condition === undefined) {
    throw new ValidationError(
      'EscrowCreate: Either Condition or FinishAfter must be specified',
    )
  }

  if (tx.CancelAfter !== undefined && typeof tx.CancelAfter !== 'number') {
    throw new ValidationError('EscrowCreate: CancelAfter must be a number')
  }

  if (tx.FinishAfter !== undefined && typeof tx.FinishAfter !== 'number') {
    throw new ValidationError('EscrowCreate: FinishAfter must be a number')
  }

  if (tx.Condition !== undefined && typeof tx.Condition !== 'string') {
    throw new ValidationError('EscrowCreate: Condition must be a string')
  }

  if (
    tx.DestinationTag !== undefined &&
    typeof tx.DestinationTag !== 'number'
  ) {
    throw new ValidationError('EscrowCreate: DestinationTag must be a number')
  }
}
