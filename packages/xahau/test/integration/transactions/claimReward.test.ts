import { assert } from 'chai'

import { ClaimReward, ClaimRewardFlags, SetHook } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { generateFundedWallet, testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

const acceptHook =
  '0061736D0100000001130360027F7F017F60037F7F7E017E60017F017E02170203656E76025F67000003656E760661636365707400010302010205030100020621057F01418088040B7F004180080B7F004180080B7F00418088040B7F004180080B07080104686F6F6B00020A9D80000199800000410141011080808080001A410041004200108180808000'

describe('ClaimReward', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'opt in',
    async () => {
      const hookWallet = await generateFundedWallet(testContext.client)
      const setHookTx: SetHook = {
        TransactionType: 'SetHook',
        Account: hookWallet.classicAddress,
        Hooks: [
          {
            Hook: {
              CreateCode: acceptHook,
              HookApiVersion: 0,
              HookNamespace: '00'.repeat(32),
            },
          },
        ],
      }
      await testTransaction(testContext.client, setHookTx, hookWallet)

      const tx: ClaimReward = {
        TransactionType: 'ClaimReward',
        Account: testContext.wallet.classicAddress,
        Issuer: hookWallet.classicAddress,
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
