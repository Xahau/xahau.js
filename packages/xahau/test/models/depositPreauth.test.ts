import { validateDepositPreauth } from '../../src/models/transactions/depositPreauth'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void =>
  assertTxIsValid(tx, validateDepositPreauth)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateDepositPreauth, message)

/**
 * DepositPreauth Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('DepositPreauth', function () {
  let depositPreauth: any

  beforeEach(function () {
    depositPreauth = {
      TransactionType: 'DepositPreauth',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
    } as any
  })

  it('verifies valid DepositPreauth when only Authorize is provided', function () {
    depositPreauth.Authorize = 'rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW'
    assertValid(depositPreauth)
  })

  it('verifies valid DepositPreauth when only Unauthorize is provided', function () {
    depositPreauth.Unauthorize = 'raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n'
    assertValid(depositPreauth)
  })

  it('throws when both Authorize and Unauthorize are provided', function () {
    depositPreauth.Authorize = 'rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW'
    depositPreauth.Unauthorize = 'raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n'
    assertInvalid(
      depositPreauth,
      "DepositPreauth: can't provide both Authorize and Unauthorize fields",
    )
  })

  it('throws when neither Authorize nor Unauthorize are provided', function () {
    assertInvalid(
      depositPreauth,
      'DepositPreauth: must provide either Authorize or Unauthorize field',
    )
  })

  it('throws when Authorize is not a string', function () {
    depositPreauth.Authorize = 1234
    assertInvalid(depositPreauth, 'DepositPreauth: Authorize must be a string')
  })

  it('throws when an Account attempts to preauthorize its own address', function () {
    depositPreauth.Authorize = depositPreauth.Account
    assertInvalid(
      depositPreauth,
      "DepositPreauth: Account can't preauthorize its own address",
    )
  })

  it('throws when Unauthorize is not a string', function () {
    depositPreauth.Unauthorize = 1234
    assertInvalid(
      depositPreauth,
      'DepositPreauth: Unauthorize must be a string',
    )
  })

  it('throws when an Account attempts to unauthorize its own address', function () {
    depositPreauth.Unauthorize = depositPreauth.Account
    assertInvalid(
      depositPreauth,
      "DepositPreauth: Account can't unauthorize its own address",
    )
  })
})
