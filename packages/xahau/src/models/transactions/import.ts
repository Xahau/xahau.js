import { ValidationError } from '../../errors'
import { isHex } from '../utils'

import {
  BaseTransaction,
  isString,
  validateBaseTransaction,
  validateOptionalField,
  validateRequiredField,
} from './common'

const MAX_BLOB_LENGTH = 512

/**
 *
 *
 * @category Transaction Models
 */
export interface Import extends BaseTransaction {
  TransactionType: 'Import'
  /**
   *
   */
  Issuer?: string
  /**
   * Hex value representing a VL Blob.
   */
  Blob?: string
}

/**
 * Verify the form and type of an Import at runtime.
 *
 * @param tx - An Import Transaction.
 * @throws When the Import is Malformed.
 */
export function validateImport(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  validateOptionalField(tx, 'Issuer', isString)

  if (tx.Account === tx.Issuer) {
    throw new ValidationError('Import: Issuer and Account must not be equal')
  }

  validateRequiredField(tx, 'Blob', isString)

  if (!isHex(tx.Blob)) {
    throw new ValidationError('Import: Blob must be in hex format')
  }

  if (tx.Blob.length > MAX_BLOB_LENGTH) {
    throw new ValidationError(
      `Import: Blob must be less than ${MAX_BLOB_LENGTH} characters`,
    )
  }
}
