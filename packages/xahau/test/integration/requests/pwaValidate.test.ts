import { assert } from 'chai'

import {
  AccountSet,
  convertStringToHex,
  PwaValidateRequest,
  PwaValidateResponse,
} from '../../../src'
import sha512Half from '../../../src/utils/hashes/sha512Half'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { generateFundedWallet, testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('pwa_validate', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'no loader',
    async () => {
      const wallet = await generateFundedWallet(testContext.client)
      const request: PwaValidateRequest = {
        command: 'pwa_validate',
        account: wallet.classicAddress,
        hash: '0'.repeat(64),
      }

      const response = await testContext.client.request(request)

      const expectedResponse: PwaValidateResponse = {
        api_version: 1,
        id: response.id,
        type: 'response',
        result: {
          ledger_index: response.result.ledger_index,
          reason: 'no loader',
          valid: false,
        },
      }
      assert.deepEqual(response, expectedResponse)
    },
    TIMEOUT,
  )

  it(
    'valid loader',
    async () => {
      const appLoader = convertStringToHex(
        '<!DOCTYPE html><html><body>hi</body></html>',
      )
      const set: AccountSet = {
        TransactionType: 'AccountSet',
        Account: testContext.wallet.classicAddress,
        AppLoader: appLoader,
      }
      await testTransaction(testContext.client, set, testContext.wallet)

      const request: PwaValidateRequest = {
        command: 'pwa_validate',
        account: testContext.wallet.classicAddress,
        hash: sha512Half(appLoader),
      }

      const response = await testContext.client.request(request)

      assert.equal(response.result.valid, true)
      assert.equal(response.result.app_loader_sequence, 1)
    },
    TIMEOUT,
  )
})
