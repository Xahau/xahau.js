import { validateURITokenMint } from '../../src/models/transactions/uriTokenMint'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateURITokenMint)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateURITokenMint, message)

/**
 * URITokenMint Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('URITokenMint', function () {
  let tx: any

  beforeEach(function () {
    tx = {
      TransactionType: 'URITokenMint',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '12',
      URI: '697066733A2F2F62616679626569676479727A74',
    } as any
  })

  it(`verifies valid URITokenMint`, function () {
    assertValid(tx)
  })

  it(`verifies valid URITokenMint w/ optional fields`, function () {
    tx.Digest =
      '6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B'
    tx.Amount = '1000000'
    tx.Destination = 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn'
    assertValid(tx)

    tx.Amount = {
      currency: 'USD',
      issuer: 'rcXY84C4g14iFp6taFXjjQGVeHqSCh9RX',
      value: '1',
    }
    assertValid(tx)
  })

  it(`throws w/ URI not in hex format`, function () {
    tx.URI = 'ipfs://not-hex'
    assertInvalid(tx, 'URITokenMint: URI must be in hex format')
  })
})
