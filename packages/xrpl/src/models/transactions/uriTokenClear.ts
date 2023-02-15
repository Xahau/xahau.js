import { ValidationError } from '../../errors'

import { BaseTransaction, validateBaseTransaction } from './common'

/**
 * Map of flags to boolean values representing {@link URITokenClear} transaction
 * flags.
 *
 * @category Transaction Flags
 *
 * @example
 * ```typescript
 * const tx: URITokenClear = {
 * Account: 'rhFcpWDHLqpBmX4ezWiA5VLSS4e1BHqhHd',
 * URITokenID: '7AFCE32EBA8BD310CC2D00BE10B76E2183337EA20444D4580E4DBDB396C101FB',
 * TransactionType: 'URITokenCancelSellOffer',
 * }
 *
 * // Autofill the tx to see how flags actually look compared to the interface usage.
 * const autofilledTx = await client.autofill(tx)
 * console.log(autofilledTx)
 * // {
 * // Account: 'rhFcpWDHLqpBmX4ezWiA5VLSS4e1BHqhHd',
 * // URITokenID: '7AFCE32EBA8BD310CC2D00BE10B76E2183337EA20444D4580E4DBDB396C101FB',
 * // TransactionType: 'URITokenCancelSellOffer',
 * // Sequence: 21970384,
 * // Fee: '12',
 * // LastLedgerSequence: 21970404
 * // }
 * ```
 */

/**
 * An URITokenClear transaction is effectively a limit order . It defines an
 * intent to exchange currencies, and creates an Offer object if not completely.
 * Fulfilled when placed. Offers can be partially fulfilled.
 *
 * @category Transaction Models
 */
export interface URITokenClear extends BaseTransaction {
  TransactionType: 'URITokenCancelSellOffer'
  /**
   * Identifies the URITokenID of the NFToken object that the
   * offer references.
   */
  URITokenID: string
}

/**
 * Verify the form and type of an URITokenClear at runtime.
 *
 * @param tx - An URITokenClear Transaction.
 * @throws When the URITokenClear is Malformed.
 */
export function validateURITokenClear(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  if (tx.URITokenID == null) {
    throw new ValidationError('URITokenClear: missing field URITokenID')
  }
}
