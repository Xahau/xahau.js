import { validateURITokenBurn } from '../../src/models/transactions/uriTokenBurn'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateURITokenBurn)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateURITokenBurn, message)

/**
 * URITokenBurn Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('URITokenBurn', function () {
  let tx: any

  beforeEach(function () {
    tx = {
      TransactionType: 'URITokenBurn',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '12',
      URITokenID:
        'AED08CC1F50DD5F23A1948AF86153A3F3B7593E5EC77D65A02BB1B29E05AB6AE',
    } as any
  })

  it(`verifies valid URITokenBurn`, function () {
    assertValid(tx)
  })

  it(`throws w/ missing URITokenID`, function () {
    delete tx.URITokenID
    assertInvalid(tx, 'URITokenBurn: missing field URITokenID')
  })
})
