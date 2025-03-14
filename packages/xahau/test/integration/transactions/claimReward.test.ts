import { assert } from 'chai'

import { ClaimReward, ClaimRewardFlags } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('ClaimReward', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'opt in',
    async () => {
      const tx: ClaimReward = {
        TransactionType: 'ClaimReward',
        Account: testContext.wallet.classicAddress,
        Issuer: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
      }

      await testTransaction(testContext.client, tx, testContext.wallet)

      const accountInfoResponse = await testContext.client.request({
        command: 'account_info',
        account: testContext.wallet.classicAddress,
      })
      assert.exists(accountInfoResponse.result.account_data.RewardAccumulator)
      assert.exists(accountInfoResponse.result.account_data.RewardLgrFirst)
      assert.exists(accountInfoResponse.result.account_data.RewardLgrLast)
      assert.exists(accountInfoResponse.result.account_data.RewardTime)
    },
    TIMEOUT,
  )
  it(
    'opt out',
    async () => {
      const tx: ClaimReward = {
        TransactionType: 'ClaimReward',
        Account: testContext.wallet.classicAddress,
        Flags: ClaimRewardFlags.tfOptOut,
      }

      await testTransaction(testContext.client, tx, testContext.wallet)

      const accountInfoResponse = await testContext.client.request({
        command: 'account_info',
        account: testContext.wallet.classicAddress,
      })
      assert.notExists(
        accountInfoResponse.result.account_data.RewardAccumulator,
      )
      assert.notExists(accountInfoResponse.result.account_data.RewardLgrFirst)
      assert.notExists(accountInfoResponse.result.account_data.RewardLgrLast)
      assert.notExists(accountInfoResponse.result.account_data.RewardTime)
    },
    TIMEOUT,
  )
})
