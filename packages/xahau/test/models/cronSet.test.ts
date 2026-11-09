/* eslint-disable import/no-deprecated -- using deprecated setTransactionFlagsToNumber to ensure no breaking changes */
import { setTransactionFlagsToNumber } from '../../src'
import {
  CronSetFlags,
  validateCronSet,
} from '../../src/models/transactions/cronSet'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateCronSet)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateCronSet, message)

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

    assertValid(validCronSet)

    validCronSet = {
      TransactionType: 'CronSet',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '100',
      Flags: CronSetFlags.tfCronUnset,
    } as any

    assertValid(validCronSet)

    validCronSet = {
      TransactionType: 'CronSet',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '100',
      Flags: { tfCronUnset: true },
    } as any

    setTransactionFlagsToNumber(validCronSet)
    assertValid(validCronSet)
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

    assertInvalid(
      invalidDeleteOperation,
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

    assertInvalid(
      invalidRepeatCount,
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

    assertInvalid(
      invalidDelaySeconds,
      `CronSet: DelaySeconds must be less than ${365 * 24 * 60 * 60}`,
    )
  })
})
