import { assert } from 'chai'

import { URITokenBuy } from '../../../dist/npm'
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
import { generateFundedWallet, testTransaction } from '../utils'

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
      const wallet1 = await generateFundedWallet(testContext.client)

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

      const buyTx: URITokenBuy = {
        TransactionType: 'URITokenBuy',
        Account: wallet1.classicAddress,
        URITokenID: uriTokenID,
        Amount: xrpToDrops(10),
      }

      await testTransaction(testContext.client, buyTx, wallet1)

      // check that wallet1 owns uritoken
      assert.equal(
        (
          await testContext.client.request({
            command: 'account_objects',
            account: wallet1.classicAddress,
          })
        ).result.account_objects.length,
        1,
      )
      // check that wallet1 does not own uritoken
      assert.equal(
        (
          await testContext.client.request({
            command: 'account_objects',
            account: testContext.wallet.classicAddress,
          })
        ).result.account_objects.length,
        0,
      )
    },
    TIMEOUT,
  )
})
