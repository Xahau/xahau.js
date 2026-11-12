import { Signer } from '../common'

import { BaseTransaction } from './common'

/**
 * A UNL validator's multisignature over a pending export (Export amendment).
 * Injected by validators: it uses the zero account, pays no fee and is
 * unsigned. It is only ever created by validators, but it is deliberately not
 * a pseudo-transaction: a disputed pseudo-transaction is discarded, whereas
 * an ExportSign is retried.
 *
 * @category Transaction Models
 */
export interface ExportSign extends BaseTransaction {
  TransactionType: 'ExportSign'
  /** The ledger index in which the export was created. */
  LedgerSequence: number
  /** The id, without signatures, of the export being signed. */
  TransactionHash: string
  /** The signature of one export key. This is the bare inner object, not wrapped in `{ Signer: ... }`. */
  Signer: Signer['Signer']
}
