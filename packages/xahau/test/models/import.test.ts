import { validateImport } from '../../src/models/transactions/import'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateImport)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateImport, message)

/**
 * Import Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('Import', function () {
  it(`verifies valid Import`, function () {
    const validImport = {
      TransactionType: 'Import',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Blob: 'DEADBEEF',
      Fee: '12',
    } as any

    assertValid(validImport)
  })

  it(`throws w/ bad Issuer`, function () {
    const invalidIssuer = {
      TransactionType: 'Import',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 1,
      Blob: 'DEADBEEF',
      Fee: '12',
    } as any

    assertInvalid(invalidIssuer, 'Import: invalid field Issuer')
  })
  it(`throws w/ redundant Issuer`, function () {
    const invalidIssuer = {
      TransactionType: 'Import',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Blob: 'DEADBEEF',
      Fee: '12',
    } as any

    assertInvalid(invalidIssuer, 'Import: Issuer and Account must not be equal')
  })
  it(`throws w/ bad Blob`, function () {
    const invalidBlob = {
      TransactionType: 'Import',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      Blob: 1,
      Fee: '12',
    } as any

    assertInvalid(invalidBlob, 'Import: invalid field Blob')
  })
  it(`throws w/ bad Blob Hex`, function () {
    const invalidBlob = {
      TransactionType: 'Import',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      Blob: 'ZZ11',
      Fee: '12',
    } as any

    assertInvalid(invalidBlob, 'Import: Blob must be in hex format')
  })
})
