import { ValidationError } from '../../errors'

import {
  BaseTransaction,
  isArray,
  isString,
  validateBaseTransaction,
  validateRequiredField,
} from './common'

export enum RemarkFlags {
  tfImmutable = 0x00000001,
}

export interface RemarkFlagsInterface {
  tfImmutable?: boolean
}

export interface Remark {
  Remark: {
    RemarkName: string
    RemarkValue?: string
    Flags?: number | RemarkFlagsInterface
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

  validateRequiredField(tx, 'ObjectID', isString)

  if (!HEX_REGEX.test(tx.ObjectID)) {
    throw new ValidationError(
      'SetRemarks: ObjectID must be a 256-bit (32-byte) hexadecimal value',
    )
  }

  validateRequiredField(tx, 'Remarks', isArray)

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
