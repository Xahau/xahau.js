import { ValidationError } from '../../errors'

import { BaseTransaction, validateBaseTransaction } from './common'

export interface Remark {
  Remark: {
    RemarkName: string
    RemarkValue?: string
    Flags?: string
  }
}

/**
 * A SetRemarks transaction assigns, changes, or removes the remarks associated with a object.
 *
 * @category Transaction Models
 */
export interface SetRemarks extends BaseTransaction {
  TransactionType: 'SetRemarks'
  ObjectID: string
  Remarks: Remark[]
}

const HEX_REGEX = /^[0-9A-Fa-f]{64}$/u
const MAX_REMARKS = 32
const MAX_REMARK_NAME_LENGTH = 256
const MAX_REMARK_VALUE_LENGTH = 256

/**
 * Verify the form and type of a SetRemarks at runtime.
 *
 * @param tx - A SetRemarks Transaction.
 * @throws When the SetRemarks is malformed.
 */
export function validateSetRemarks(tx: Record<string, unknown>): void {
  validateBaseTransaction(tx)

  if (tx.ObjectID == null) {
    throw new ValidationError('SetRemarks: ObjectID is required')
  }

  if (typeof tx.ObjectID !== 'string' || !HEX_REGEX.test(tx.ObjectID)) {
    throw new ValidationError(
      'SetRemarks: ObjectID must be a 256-bit (32-byte) hexadecimal value',
    )
  }

  if (tx.Remarks == null) {
    throw new ValidationError('SetRemarks: Remarks is required')
  }

  if (!Array.isArray(tx.Remarks)) {
    throw new ValidationError('SetRemarks: Remarks must be an array')
  }

  if (tx.Remarks.length > MAX_REMARKS) {
    throw new ValidationError(
      `SetRemarks: maximum of ${MAX_REMARKS} remarks allowed in Remarks`,
    )
  }

  for (const remark of tx.Remarks) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Should be a Remark
    const remarkObject = remark as Remark
    const { RemarkName, RemarkValue } = remarkObject.Remark

    if (RemarkName.length > MAX_REMARK_NAME_LENGTH * 2) {
      throw new ValidationError(
        `SetRemarks: maximum of ${MAX_REMARK_NAME_LENGTH} bytes allowed in RemarkName`,
      )
    }

    if (
      RemarkValue != null &&
      RemarkValue.length > MAX_REMARK_VALUE_LENGTH * 2
    ) {
      throw new ValidationError(
        `SetRemarks: maximum of ${MAX_REMARK_VALUE_LENGTH} bytes allowed in RemarkValue`,
      )
    }
  }
}
