import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateInvoke } from '../../src/models/transactions/invoke'

/**
 * Invoke Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('Invoke', function () {
  it(`verifies valid Invoke`, function () {
    const validInvoke = {
      TransactionType: 'Invoke',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Destination: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      Fee: '12',
    } as any

    assert.doesNotThrow(() => validateInvoke(validInvoke))
    assert.doesNotThrow(() => validate(validInvoke))
  })

  it(`throws w/ redundant Issuer`, function () {
    const invalidIssuer = {
      TransactionType: 'Invoke',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Destination: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '12',
    } as any

    assert.throws(
      () => validateInvoke(invalidIssuer),
      ValidationError,
      'Invoke: Destination and Account must not be equal',
    )
    assert.throws(
      () => validate(invalidIssuer),
      ValidationError,
      'Invoke: Destination and Account must not be equal',
    )
  })
})
