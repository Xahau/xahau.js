import { validateAccountSet } from '../../src/models/transactions/accountSet'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateAccountSet)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateAccountSet, message)

/**
 * AccountSet Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('AccountSet', function () {
  let tx: any

  beforeEach(function () {
    tx = {
      TransactionType: 'AccountSet',
      Account: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
      Fee: '12',
      Sequence: 5,
      Domain: '6578616D706C652E636F6D',
      SetFlag: 5,
      MessageKey:
        '03AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB',
    }
  })

  it(`verifies valid AccountSet`, function () {
    assertValid(tx)
  })

  it(`verifies SetFlag asfExporter`, function () {
    tx.SetFlag = 18
    assertValid(tx)
  })

  it(`throws w/ invalid SetFlag (out of range)`, function () {
    tx.SetFlag = 20
    assertInvalid(tx, 'AccountSet: invalid SetFlag')
  })

  it(`throws w/ invalid SetFlag (incorrect type)`, function () {
    tx.SetFlag = 'abc'
    assertInvalid(tx, 'AccountSet: invalid SetFlag')
  })

  it(`throws w/ invalid ClearFlag`, function () {
    tx.ClearFlag = 20
    assertInvalid(tx, 'AccountSet: invalid ClearFlag')
  })

  it(`throws w/ invalid Domain`, function () {
    tx.Domain = 6578616
    assertInvalid(tx, 'AccountSet: invalid Domain')
  })

  it(`throws w/ invalid EmailHash`, function () {
    tx.EmailHash = 6578656789876543
    assertInvalid(tx, 'AccountSet: invalid EmailHash')
  })

  it(`throws w/ invalid MessageKey`, function () {
    tx.MessageKey = 6578656789876543
    assertInvalid(tx, 'AccountSet: invalid MessageKey')
  })

  it(`throws w/ invalid TransferRate`, function () {
    tx.TransferRate = '1000000001'
    assertInvalid(tx, 'AccountSet: invalid TransferRate')
  })

  it(`throws w/ invalid TickSize`, function () {
    tx.TickSize = 20
    assertInvalid(tx, 'AccountSet: invalid TickSize')
  })

  it(`throws w/ invalid NFTokenMinter`, function () {
    tx.NFTokenMinter = ''
    assertInvalid(tx, 'AccountSet: invalid field NFTokenMinter')
  })

  it(`throws w/ invalid HookStateScale`, function () {
    tx.HookStateScale = ''
    assertInvalid(tx, 'AccountSet: invalid field HookStateScale')

    tx.HookStateScale = 17
    assertInvalid(
      tx,
      'AccountSet: HookStateScale must be less than or equal to 16',
    )

    tx.HookStateScale = 0
    assertInvalid(
      tx,
      'AccountSet: HookStateScale must be greater than or equal to 1',
    )
  })

  it(`verifies valid AppLoader`, function () {
    tx.AppLoader = '3C68746D6C3E'
    assertValid(tx)

    tx.AppLoader = ''
    assertValid(tx)

    tx.AppLoader = 'AB'.repeat(4096)
    assertValid(tx)
  })

  it(`throws w/ invalid AppLoader`, function () {
    tx.AppLoader = 123
    assertInvalid(tx, 'AccountSet: invalid field AppLoader')

    tx.AppLoader = '<html>'
    assertInvalid(tx, 'AccountSet: invalid AppLoader')

    tx.AppLoader = 'AB'.repeat(4097)
    assertInvalid(tx, 'AccountSet: AppLoader must be at most 4096 bytes')
  })
})
