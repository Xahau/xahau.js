import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateSetRemarks } from '../../src/models/transactions/setRemarks'

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
    assert.doesNotThrow(() => validateSetRemarks(tx))
    assert.doesNotThrow(() => validate(tx))
  })

  it(`throws w/ invalid ObjectID in Remarks`, function () {
    delete tx.ObjectID
    let errorMessage = 'SetRemarks: ObjectID is required'
    assert.throws(() => validateSetRemarks(tx), ValidationError, errorMessage)
    assert.throws(() => validate(tx), ValidationError, errorMessage)

    tx.ObjectID = 'DEADBEEF'
    errorMessage =
      'SetRemarks: ObjectID must be a 256-bit (32-byte) hexadecimal value'
    assert.throws(() => validateSetRemarks(tx), ValidationError, errorMessage)
    assert.throws(() => validate(tx), ValidationError, errorMessage)
  })

  it(`throws w/ invalid Remarks in Remarks`, function () {
    delete tx.Remarks
    let errorMessage = 'SetRemarks: Remarks is required'
    assert.throws(() => validateSetRemarks(tx), ValidationError, errorMessage)
    assert.throws(() => validate(tx), ValidationError, errorMessage)

    tx.Remarks = 'DEABEEF'
    errorMessage = 'SetRemarks: Remarks must be an array'
    assert.throws(() => validateSetRemarks(tx), ValidationError, errorMessage)
    assert.throws(() => validate(tx), ValidationError, errorMessage)

    tx.Remarks = Array(33)
      .fill(null)
      .map((_, idx) => ({
        Remark: {
          RemarkName: `DEADBEEF${idx.toString(16)}`,
          RemarkValue: `DEADBEEF${idx.toString(16)}`,
        },
      }))
    errorMessage = `SetRemarks: maximum of 32 remarks allowed in Remarks`
    assert.throws(() => validateSetRemarks(tx), ValidationError, errorMessage)
    assert.throws(() => validate(tx), ValidationError, errorMessage)

    tx.Remarks = [
      {
        Remark: {
          RemarkName: 'DEADBEEF'.repeat(256 / 4 + 1),
          RemarkValue: 'DEADBEEF',
        },
      },
    ]
    errorMessage = `SetRemarks: maximum of 256 bytes allowed in RemarkName`
    assert.throws(() => validateSetRemarks(tx), ValidationError, errorMessage)
    assert.throws(() => validate(tx), ValidationError, errorMessage)

    tx.Remarks = [
      {
        Remark: {
          RemarkName: 'DEADBEEF',
          RemarkValue: 'DEADBEEF'.repeat(256 / 4 + 1),
        },
      },
    ]
    errorMessage = `SetRemarks: maximum of 256 bytes allowed in RemarkValue`
    assert.throws(() => validateSetRemarks(tx), ValidationError, errorMessage)
    assert.throws(() => validate(tx), ValidationError, errorMessage)
  })
})
