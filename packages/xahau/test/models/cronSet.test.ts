import { assert } from 'chai'

import {
  setTransactionFlagsToNumber,
  validate,
  ValidationError,
} from '../../src'
import {
  CronSetFlags,
  validateCronSet,
} from '../../src/models/transactions/cronSet'

/**
 * CronSet Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('CronSet', function () {
  it(`verifies valid CronSet`, function () {
    let validCronSet = {
      TransactionType: 'CronSet',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '100',
      RepeatCount: 256,
      DelaySeconds: 365 * 24 * 60 * 60,
      StartTime: 0,
    } as any

    assert.doesNotThrow(() => validateCronSet(validCronSet))
    assert.doesNotThrow(() => validate(validCronSet))

    validCronSet = {
      TransactionType: 'CronSet',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '100',
      Flags: CronSetFlags.tfCronUnset,
    } as any

    assert.doesNotThrow(() => validateCronSet(validCronSet))
    assert.doesNotThrow(() => validate(validCronSet))

    validCronSet = {
      TransactionType: 'CronSet',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '100',
      Flags: { tfCronUnset: true },
    } as any

    assert.doesNotThrow(() => {
      setTransactionFlagsToNumber(validCronSet)
      validateCronSet(validCronSet)
    })
    assert.doesNotThrow(() => validate(validCronSet))
  })

  it(`throws w/ invalid Delete Operation`, function () {
    const invalidDeleteOperation = {
      TransactionType: 'CronSet',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Flags: CronSetFlags.tfCronUnset,
      RepeatCount: 1,
      DelaySeconds: 1,
      StartTime: 1,
      Fee: '100',
    } as any

    assert.throws(
      () => validateCronSet(invalidDeleteOperation),
      ValidationError,
      'CronSet: RepeatCount, DelaySeconds, and StartTime must not be set when Flags is set to tfCronUnset',
    )
    assert.throws(
      () => validate(invalidDeleteOperation),
      ValidationError,
      'CronSet: RepeatCount, DelaySeconds, and StartTime must not be set when Flags is set to tfCronUnset',
    )
  })

  it(`throws w/ invalid RepeatCount`, function () {
    const invalidRepeatCount = {
      TransactionType: 'CronSet',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      RepeatCount: 257,
      StartTime: 1,
      DelaySeconds: 1,
      Fee: '100',
    } as any

    assert.throws(
      () => validateCronSet(invalidRepeatCount),
      ValidationError,
      'CronSet: RepeatCount must be less than 256',
    )
    assert.throws(
      () => validate(invalidRepeatCount),
      ValidationError,
      'CronSet: RepeatCount must be less than 256',
    )
  })
  it(`throws w/ invalid DelaySeconds`, function () {
    const invalidDelaySeconds = {
      TransactionType: 'CronSet',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      DelaySeconds: 365 * 24 * 60 * 60 + 1,
      StartTime: 1,
      RepeatCount: 1,
      Fee: '100',
    } as any

    assert.throws(
      () => validateCronSet(invalidDelaySeconds),
      ValidationError,
      `CronSet: DelaySeconds must be less than ${365 * 24 * 60 * 60}`,
    )
    assert.throws(
      () => validate(invalidDelaySeconds),
      ValidationError,
      `CronSet: DelaySeconds must be less than ${365 * 24 * 60 * 60}`,
    )
  })
})
