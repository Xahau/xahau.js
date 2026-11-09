import { validateInvoke } from '../../src/models/transactions/invoke'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateInvoke)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateInvoke, message)

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

    assertValid(validInvoke)
  })

  it(`throws w/ redundant Issuer`, function () {
    const invalidIssuer = {
      TransactionType: 'Invoke',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Destination: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '12',
    } as any

    assertInvalid(
      invalidIssuer,
      'Invoke: Destination and Account must not be equal',
    )
  })
})
