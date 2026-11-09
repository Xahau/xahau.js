import { validateClaimReward } from '../../src/models/transactions/claimReward'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateClaimReward)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateClaimReward, message)

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

    assertValid(validClaim)
  })

  it(`throws w/ invalid Issuer`, function () {
    const invalidIssuer = {
      TransactionType: 'ClaimReward',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 1,
      Fee: '12',
    } as any

    assertInvalid(invalidIssuer, 'ClaimReward: invalid field Issuer')
  })
  it(`throws w/ redundant Issuer`, function () {
    const invalidIssuer = {
      TransactionType: 'ClaimReward',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '12',
    } as any

    assertInvalid(
      invalidIssuer,
      'ClaimReward: Account and Issuer cannot be the same',
    )
  })
})
