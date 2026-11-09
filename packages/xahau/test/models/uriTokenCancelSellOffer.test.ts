import { validateURITokenCancelSellOffer } from '../../src/models/transactions/uriTokenCancelSellOffer'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void =>
  assertTxIsValid(tx, validateURITokenCancelSellOffer)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateURITokenCancelSellOffer, message)

/**
 * URITokenCancelSellOffer Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('URITokenCancelSellOffer', function () {
  let tx: any

  beforeEach(function () {
    tx = {
      TransactionType: 'URITokenCancelSellOffer',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '12',
      URITokenID:
        'AED08CC1F50DD5F23A1948AF86153A3F3B7593E5EC77D65A02BB1B29E05AB6AE',
    } as any
  })

  it(`verifies valid URITokenCancelSellOffer`, function () {
    assertValid(tx)
  })

  it(`throws w/ missing URITokenID`, function () {
    delete tx.URITokenID
    assertInvalid(tx, 'URITokenCancelSellOffer: missing field URITokenID')
  })
})
