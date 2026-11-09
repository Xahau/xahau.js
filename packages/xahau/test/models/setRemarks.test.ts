import { validateSetRemarks } from '../../src/models/transactions/setRemarks'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateSetRemarks)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateSetRemarks, message)

/**
 * SetRemarks Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('SetRemarks', function () {
  let tx: any

  beforeEach(function () {
    tx = {
      TransactionType: 'SetRemarks',
      Account: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      Fee: '12',
      ObjectID:
        '0000000000000000000000000000000000000000000000000000000000000000',
      Remarks: [
        {
          Remark: {
            RemarkName: 'DEADBEEF',
            RemarkValue: 'DEADBEEF',
          },
        },
      ],
    } as any
  })

  it(`verifies valid SetRemarks`, function () {
    assertValid(tx)

    tx.Remarks[0].Remark.Flags = { tfImmutable: true }
    assertValid(tx)

    tx.Remarks = [{ Remark: { RemarkName: 'DEADBEEF' } }]
    assertValid(tx)
  })

  it(`throws w/ invalid ObjectID`, function () {
    delete tx.ObjectID
    let errorMessage = 'SetRemarks: missing field ObjectID'
    assertInvalid(tx, errorMessage)

    tx.ObjectID = 1
    errorMessage = 'SetRemarks: invalid field ObjectID'
    assertInvalid(tx, errorMessage)

    tx.ObjectID = 'DEADBEEF'
    errorMessage =
      'SetRemarks: ObjectID must be a 256-bit (32-byte) hexadecimal value'
    assertInvalid(tx, errorMessage)
  })

  it(`throws w/ invalid Remarks`, function () {
    delete tx.Remarks
    let errorMessage = 'SetRemarks: missing field Remarks'
    assertInvalid(tx, errorMessage)

    tx.Remarks = 'DEABEEF'
    errorMessage = 'SetRemarks: invalid field Remarks'
    assertInvalid(tx, errorMessage)

    tx.Remarks = Array(33)
      .fill(null)
      .map((_, idx) => ({
        Remark: {
          RemarkName: `DEADBEEF${idx.toString(16)}`,
          RemarkValue: `DEADBEEF${idx.toString(16)}`,
        },
      }))
    errorMessage = `SetRemarks: maximum of 32 remarks allowed in Remarks`
    assertInvalid(tx, errorMessage)

    tx.Remarks = [
      {
        Remark: {
          RemarkName: 'DEADBEEF'.repeat(256 / 4 + 1),
          RemarkValue: 'DEADBEEF',
        },
      },
    ]
    errorMessage = `SetRemarks: maximum of 256 bytes allowed in RemarkName`
    assertInvalid(tx, errorMessage)

    tx.Remarks = [
      {
        Remark: {
          RemarkName: 'DEADBEEF',
          RemarkValue: 'DEADBEEF'.repeat(256 / 4 + 1),
        },
      },
    ]
    errorMessage = `SetRemarks: maximum of 256 bytes allowed in RemarkValue`
    assertInvalid(tx, errorMessage)
  })
})
