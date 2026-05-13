import { ValidationError } from '../../errors'

import { BaseTransaction, validateBaseTransaction } from './common'

/**
 * An OfferCancel transaction removes an Offer object from the Xahau Network.
 *
 *  @category Transaction Models
 */
export interface OfferCancel extends BaseTransaction {
  TransactionType: 'OfferCancel'
  /**
   * The sequence number (or Ticket number) of a previous OfferCreate
   * transaction. If specified, cancel any offer object in the ledger that was
   * created by that transaction. It is not considered an error if the offer.
   * specified does not exist.
   */
  OfferSequence: number
  /**
   * The ID of the Escrow ledger object to cancel as a 64-character hexadecimal
   * string.
   */
  OfferID?: string
}

/**
 * Verify the form and type of an OfferCancel at runtime.
 *
 * @param tx - An OfferCancel Transaction.
 * @throws When the OfferCancel is Malformed.
 */
export function validateOfferCancel(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  if (tx.OfferSequence === undefined && tx.OfferID === undefined) {
    throw new ValidationError(
      'OfferCancel: must include OfferSequence or OfferID',
    )
  }

  if (tx.OfferSequence !== undefined && typeof tx.OfferSequence !== 'number') {
    throw new ValidationError('OfferCancel: OfferSequence must be a number')
  }

  if (tx.OfferID !== undefined && typeof tx.OfferID !== 'string') {
    throw new ValidationError('OfferCancel: OfferID must be a string')
  }
}
