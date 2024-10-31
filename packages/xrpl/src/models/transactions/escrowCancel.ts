import { ValidationError } from '../../errors'

import {
  Account,
  BaseTransaction,
  isAccount,
  validateBaseTransaction,
  validateRequiredField,
} from './common'

/**
 * Return escrowed amount to the sender.
 *
 * @category Transaction Models
 */
export interface EscrowCancel extends BaseTransaction {
  TransactionType: 'EscrowCancel'
  /** Address of the source account that funded the escrow payment. */
  Owner: Account
  /**
   * Transaction sequence (or Ticket  number) of EscrowCreate transaction that.
   * created the escrow to cancel.
   */
  OfferSequence?: number | string
  /**
   * The ID of the Escrow ledger object to cancel as a 64-character hexadecimal
   * string.
   */
  EscrowID?: string
}

/**
 * Verify the form and type of an EscrowCancel at runtime.
 *
 * @param tx - An EscrowCancel Transaction.
 * @throws When the EscrowCancel is Malformed.
 */
export function validateEscrowCancel(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  validateRequiredField(tx, 'Owner', isAccount)

  if (tx.OfferSequence == null && tx.EscrowID == null) {
    throw new ValidationError(
      'EscrowCancel: must include OfferSequence or EscrowID',
    )
  }

  if (tx.EscrowID != null && typeof tx.EscrowID !== 'string') {
    throw new ValidationError('EscrowCancel: invalid EscrowID')
  }

  if (
    (tx.OfferSequence != null &&
      typeof tx.OfferSequence !== 'number' &&
      typeof tx.OfferSequence !== 'string') ||
    Number.isNaN(Number(tx.OfferSequence))
  ) {
    throw new ValidationError('EscrowCancel: OfferSequence must be a number')
  }
}
