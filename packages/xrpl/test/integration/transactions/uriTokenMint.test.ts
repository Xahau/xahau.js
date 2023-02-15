import { assert } from 'chai'

import { convertStringToHex, URITokenMint } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('URITokenMint', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const tx: URITokenMint = {
        TransactionType: 'URITokenMint',
        Account: testContext.wallet.classicAddress,
        URI: convertStringToHex('ipfs://CID'),
      }

      await testTransaction(testContext.client, tx, testContext.wallet)

      // check that the object was actually created
      assert.equal(
        (
          await testContext.client.request({
            command: 'account_objects',
            account: testContext.wallet.classicAddress,
          })
        ).result.account_objects.length,
        1,
      )
    },
    TIMEOUT,
  )
})
