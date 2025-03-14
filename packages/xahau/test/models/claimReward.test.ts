import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateClaimReward } from '../../src/models/transactions/claimReward'

/**
 * ClaimReward Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('ClaimReward', function () {
  it(`verifies valid ClaimReward`, function () {
    const validClaim = {
      TransactionType: 'ClaimReward',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      Fee: '12',
    } as any

    assert.doesNotThrow(() => validateClaimReward(validClaim))
    assert.doesNotThrow(() => validate(validClaim))
  })

  it(`throws w/ invalid Issuer`, function () {
    const invalidIssuer = {
      TransactionType: 'ClaimReward',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 1,
      Fee: '12',
    } as any

    assert.throws(
      () => validateClaimReward(invalidIssuer),
      ValidationError,
      'ClaimReward: Issuer must be a string',
    )
    assert.throws(
      () => validate(invalidIssuer),
      ValidationError,
      'ClaimReward: Issuer must be a string',
    )
  })
  it(`throws w/ redundant Issuer`, function () {
    const invalidIssuer = {
      TransactionType: 'ClaimReward',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '12',
    } as any

    assert.throws(
      () => validateClaimReward(invalidIssuer),
      ValidationError,
      'ClaimReward: Account and Issuer cannot be the same',
    )
    assert.throws(
      () => validate(invalidIssuer),
      ValidationError,
      'ClaimReward: Account and Issuer cannot be the same',
    )
  })
})
