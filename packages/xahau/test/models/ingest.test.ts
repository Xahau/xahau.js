import { validateIngest } from '../../src/models/transactions/ingest'
import { assertTxIsValid, assertTxValidationError } from '../testUtils'

const assertValid = (tx: any): void => assertTxIsValid(tx, validateIngest)
const assertInvalid = (tx: any, message: string): void =>
  assertTxValidationError(tx, validateIngest, message)

/**
 * Ingest Transaction Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */
describe('Ingest', function () {
  let tx: any

  beforeEach(function () {
    tx = {
      TransactionType: 'Ingest',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Fee: '100',
      RemoteNetworkID: 0,
      LedgerSequence: 1234,
      Blob: 'DEADBEEF',
    }
  })

  it('verifies valid Ingest', function () {
    assertValid(tx)
  })

  it('throws w/ missing RemoteNetworkID', function () {
    delete tx.RemoteNetworkID
    assertInvalid(tx, 'Ingest: missing field RemoteNetworkID')
  })

  it('throws w/ invalid RemoteNetworkID', function () {
    tx.RemoteNetworkID = '0'
    assertInvalid(tx, 'Ingest: invalid field RemoteNetworkID')
  })

  it('throws w/ missing LedgerSequence', function () {
    delete tx.LedgerSequence
    assertInvalid(tx, 'Ingest: missing field LedgerSequence')
  })

  it('throws w/ invalid LedgerSequence', function () {
    tx.LedgerSequence = '1234'
    assertInvalid(tx, 'Ingest: invalid field LedgerSequence')
  })

  it('throws w/ missing Blob', function () {
    delete tx.Blob
    assertInvalid(tx, 'Ingest: missing field Blob')
  })

  it('throws w/ invalid Blob', function () {
    tx.Blob = 1234
    assertInvalid(tx, 'Ingest: invalid field Blob')
  })

  it('throws w/ non-hex Blob', function () {
    tx.Blob = 'xyz'
    assertInvalid(tx, 'Ingest: Blob must be in hex format')
  })
})
