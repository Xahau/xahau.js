import { validateURITokenCreateSellOffer } from '../../src/models/transactions/uriTokenCreateSellOffer'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void =>
  assertTxIsValid(tx, validateURITokenCreateSellOffer)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateURITokenCreateSellOffer, message)

/**
 * URITokenCreateSellOffer Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('URITokenCreateSellOffer', function () {
  let tx: any

  beforeEach(function () {
    tx = {
      TransactionType: 'URITokenCreateSellOffer',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '12',
      URITokenID:
        'AED08CC1F50DD5F23A1948AF86153A3F3B7593E5EC77D65A02BB1B29E05AB6AE',
      Amount: '1000000',
    } as any
  })

  it(`verifies valid URITokenCreateSellOffer`, function () {
    assertValid(tx)
  })

  it(`verifies valid URITokenCreateSellOffer w/ issued currency Amount`, function () {
    tx.Amount = {
      currency: 'USD',
      issuer: 'rcXY84C4g14iFp6taFXjjQGVeHqSCh9RX',
      value: '1',
    }
    assertValid(tx)
  })

  it(`verifies valid URITokenCreateSellOffer w/ Destination`, function () {
    tx.Destination = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'
    assertValid(tx)
  })

  it(`throws w/ Destination equal to Account`, function () {
    tx.Destination = tx.Account
    assertInvalid(
      tx,
      'URITokenCreateSellOffer: Destination and Account must not be equal',
    )
  })

  it(`throws w/ missing URITokenID`, function () {
    delete tx.URITokenID
    assertInvalid(tx, 'URITokenCreateSellOffer: missing field URITokenID')
  })

  it(`throws w/ missing Amount`, function () {
    delete tx.Amount
    assertInvalid(tx, 'URITokenCreateSellOffer: missing field Amount')
  })

  it(`throws w/ invalid Amount`, function () {
    tx.Amount = 1000000
    assertInvalid(tx, 'URITokenCreateSellOffer: invalid field Amount')

    tx.Amount = { currency: 'USD', value: '1' }
    assertInvalid(tx, 'URITokenCreateSellOffer: invalid field Amount')
  })
})
