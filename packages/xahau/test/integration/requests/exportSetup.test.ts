import { assert } from 'chai'

import { ExportSetupRequest, XahaudError } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'

// how long before each test case times out
const TIMEOUT = 20000

async function errorOf(
  testContext: XrplIntegrationTestContext,
  request: ExportSetupRequest,
): Promise<XahaudError & { data: { error: string; error_message: string } }> {
  let thrown: unknown
  try {
    await testContext.client.request(request)
  } catch (error) {
    thrown = error
  }
  assert.instanceOf(thrown, XahaudError)
  return thrown as XahaudError & {
    data: { error: string; error_message: string }
  }
}

// The success shape (ExportSetupResponse) needs the validators' export keys on
// the ledger: they take 512+ paced ledgers to register, so it is not tested.
describe('export_setup', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'no export keys',
    async () => {
      // The export keys are the validators' (UNLReport). A standalone node has
      // no validators, so there are none to list.
      const request: ExportSetupRequest = {
        command: 'export_setup',
        account: testContext.wallet.classicAddress,
      }
      const thrown = await errorOf(testContext, request)
      assert.equal(thrown.data.error, 'objectNotFound')
      assert.equal(
        thrown.data.error_message,
        'No export keys for the requested time.',
      )
    },
    TIMEOUT,
  )

  it(
    'invalid account',
    async () => {
      const request: ExportSetupRequest = {
        command: 'export_setup',
        account: 'not an account',
      }
      const thrown = await errorOf(testContext, request)
      assert.equal(thrown.data.error, 'invalidParams')
      assert.equal(thrown.data.error_message, "Invalid field 'account'.")
    },
    TIMEOUT,
  )

  it(
    'invalid network_id',
    async () => {
      const request: ExportSetupRequest = {
        command: 'export_setup',
        network_id: -1,
      }
      const thrown = await errorOf(testContext, request)
      assert.equal(thrown.data.error, 'invalidParams')
      assert.equal(thrown.data.error_message, "Invalid field 'network_id'.")
    },
    TIMEOUT,
  )
})
