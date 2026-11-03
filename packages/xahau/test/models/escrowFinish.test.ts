import { validateEscrowFinish } from '../../src/models/transactions/escrowFinish'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateEscrowFinish)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateEscrowFinish, message)

/**
 * EscrowFinish Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('EscrowFinish', function () {
  let escrow: any

  beforeEach(function () {
    escrow = {
      Account: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      TransactionType: 'EscrowFinish',
      Owner: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      OfferSequence: 7,
      Condition:
        'A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100',
      Fulfillment: 'A0028000',
    }
  })
  it(`verifies valid EscrowFinish`, function () {
    assertValid(escrow)
  })

  it(`verifies valid EscrowFinish w/o optional`, function () {
    delete escrow.Condition
    delete escrow.Fulfillment

    assertValid(escrow)
  })

  it(`verifies valid EscrowFinish w/string EscrowID`, function () {
    escrow.EscrowID = '7'

    assertValid(escrow)
  })

  it(`throws w/ invalid Owner`, function () {
    escrow.Owner = 0x15415253

    assertInvalid(escrow, 'EscrowFinish: invalid field Owner')
  })

  it(`throws w/ invalid OfferSequence`, function () {
    escrow.OfferSequence = 'random'

    assertInvalid(escrow, 'EscrowFinish: OfferSequence must be a number')
  })

  it(`throws w/ invalid EscrowID`, function () {
    escrow.EscrowID = 1

    assertInvalid(escrow, 'EscrowFinish: EscrowID must be a string')
  })

  it(`throws w/ invalid Condition`, function () {
    escrow.Condition = 10

    assertInvalid(escrow, 'EscrowFinish: Condition must be a string')
  })

  it(`throws w/ invalid Fulfillment`, function () {
    escrow.Fulfillment = 0x142341

    assertInvalid(escrow, 'EscrowFinish: Fulfillment must be a string')
  })
})
