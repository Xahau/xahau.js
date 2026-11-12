import { ValidationError } from '../../errors'
import { isHex } from '../utils'

import {
  BaseTransaction,
  isNumber,
  isString,
  validateBaseTransaction,
  validateRequiredField,
} from './common'

/**
 * An Ingest transaction submits an XPOF (Export amendment), which proves what
 * the transactions of another network pay: an XRPL ledger's header and its
 * parent's, the UNL and validations behind it, its transaction tree down to
 * the leaf hashes, and a sample of its transactions in full. Free while it is
 * newer than the ledger already recorded for that network.
 *
 * @category Transaction Models
 */
export interface Ingest extends BaseTransaction {
  TransactionType: 'Ingest'
  /** The network the XPOF comes from. */
  RemoteNetworkID: number
  /** The ledger index of the proven ledger on that network. */
  LedgerSequence: number
  /** Hex value representing the XPOF. */
  Blob: string
}

/**
 * Verify the form and type of an Ingest at runtime.
 *
 * @param tx - An Ingest Transaction.
 * @throws When the Ingest is Malformed.
 */
export function validateIngest(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  validateRequiredField(tx, 'RemoteNetworkID', isNumber)
  validateRequiredField(tx, 'LedgerSequence', isNumber)
  validateRequiredField(tx, 'Blob', isString)

  if (!isHex(tx.Blob)) {
    throw new ValidationError('Ingest: Blob must be in hex format')
  }
}
