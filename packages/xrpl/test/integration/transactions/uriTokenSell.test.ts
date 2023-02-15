import { assert } from 'chai'

import {
  convertStringToHex,
  URITokenMint,
  URITokenSell,
  xrpToDrops,
} from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('URITokenSell', function () {
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
      const mintResponse = await testContext.client.request({
        command: 'account_objects',
        account: testContext.wallet.classicAddress,
      })
      assert.equal(mintResponse.result.account_objects.length, 1)

      const uriTokenID = mintResponse.result.account_objects[0].index
      assert.isString(uriTokenID)

      const sellTx: URITokenSell = {
        TransactionType: 'URITokenCreateSellOffer',
        Account: testContext.wallet.classicAddress,
        URITokenID: uriTokenID,
        Amount: xrpToDrops(10),
      }

      await testTransaction(testContext.client, sellTx, testContext.wallet)

      // verify amount is on le
    },
    TIMEOUT,
  )
})
