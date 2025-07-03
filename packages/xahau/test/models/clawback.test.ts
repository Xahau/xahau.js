import { validateClawback } from '../../src/models/transactions/clawback'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateClawback)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateClawback, message)

/**
 * Clawback Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('Clawback', function () {
  it(`verifies valid Clawback`, function () {
    const validClawback = {
      TransactionType: 'Clawback',
      Amount: {
        currency: 'DSH',
        issuer: 'rcXY84C4g14iFp6taFXjjQGVeHqSCh9RX',
        value: '43.11584856965009',
      },
      Account: 'rWYkbWkCeg8dP6rXALnjgZSjjLyih5NXm',
    } as any

    assertValid(validClawback)
  })

  it(`throws w/ missing Amount`, function () {
    const missingAmount = {
      TransactionType: 'Clawback',
      Account: 'rWYkbWkCeg8dP6rXALnjgZSjjLyih5NXm',
    } as any

    assertInvalid(missingAmount, 'Clawback: missing field Amount')
  })

  it(`throws w/ invalid Amount`, function () {
    const invalidAmount = {
      TransactionType: 'Clawback',
      Amount: 100000000,
      Account: 'rWYkbWkCeg8dP6rXALnjgZSjjLyih5NXm',
    } as any

    assertInvalid(invalidAmount, 'Clawback: invalid Amount')

    const invalidStrAmount = {
      TransactionType: 'Clawback',
      Amount: '1234',
      Account: 'rWYkbWkCeg8dP6rXALnjgZSjjLyih5NXm',
    } as any

    assertInvalid(invalidStrAmount, 'Clawback: invalid Amount')
  })

  it(`throws w/ invalid holder Account`, function () {
    const invalidAccount = {
      TransactionType: 'Clawback',
      Amount: {
        currency: 'DSH',
        issuer: 'rWYkbWkCeg8dP6rXALnjgZSjjLyih5NXm',
        value: '43.11584856965009',
      },
      Account: 'rWYkbWkCeg8dP6rXALnjgZSjjLyih5NXm',
    } as any

    assertInvalid(invalidAccount, 'Clawback: invalid holder Account')
  })
})
