import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateImport } from '../../src/models/transactions/import'

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

    assert.doesNotThrow(() => validateImport(validImport))
    assert.doesNotThrow(() => validate(validImport))
  })

  it(`throws w/ bad Issuer`, function () {
    const invalidIssuer = {
      TransactionType: 'Import',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 1,
      Blob: 'DEADBEEF',
      Fee: '12',
    } as any

    assert.throws(
      () => validateImport(invalidIssuer),
      ValidationError,
      'Import: Issuer must be a string',
    )
    assert.throws(
      () => validate(invalidIssuer),
      ValidationError,
      'Import: Issuer must be a string',
    )
  })
  it(`throws w/ redundant Issuer`, function () {
    const invalidIssuer = {
      TransactionType: 'Import',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Blob: 'DEADBEEF',
      Fee: '12',
    } as any

    assert.throws(
      () => validateImport(invalidIssuer),
      ValidationError,
      'Import: Issuer and Account must not be equal',
    )
    assert.throws(
      () => validate(invalidIssuer),
      ValidationError,
      'Import: Issuer and Account must not be equal',
    )
  })
  it(`throws w/ bad Blob`, function () {
    const invalidBlob = {
      TransactionType: 'Import',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      Blob: 1,
      Fee: '12',
    } as any

    assert.throws(
      () => validateImport(invalidBlob),
      ValidationError,
      'Import: Blob must be a string',
    )
    assert.throws(
      () => validate(invalidBlob),
      ValidationError,
      'Import: Blob must be a string',
    )
  })
  it(`throws w/ bad Blob Hex`, function () {
    const invalidBlob = {
      TransactionType: 'Import',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Issuer: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      Blob: 'ZZ11',
      Fee: '12',
    } as any

    assert.throws(
      () => validateImport(invalidBlob),
      ValidationError,
      'Import: Blob must be in hex format',
    )
    assert.throws(
      () => validate(invalidBlob),
      ValidationError,
      'Import: Blob must be in hex format',
    )
  })
})
