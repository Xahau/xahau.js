import { assert } from 'chai'

import { ClaimReward, ClaimRewardFlags, SetHook, Wallet } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { testTransaction } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

const acceptHook =
  '0061736D0100000001130360027F7F017F60037F7F7E017E60017F017E02170203656E76025F67000003656E760661636365707400010302010205030100020621057F01418088040B7F004180080B7F004180080B7F00418088040B7F004180080B07080104686F6F6B00020A9D80000199800000410141011080808080001A4100410042001081808080000B'

const genesisWallet = new Wallet(
  '0330E7FC9D56BB25D6893BA3F317AE5BCF33B3291BD63DB32654A313222F7FD020',
  '001ACAAEDECE405B2A958212629E16F2EB46B153EEE94CDD350FDEFF52795525B7',
)

describe('ClaimReward', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)

    const setHookTx: SetHook = {
      TransactionType: 'SetHook',
      Account: genesisWallet.classicAddress,
      Hooks: [
        {
          Hook: {
            CreateCode: acceptHook,
            HookApiVersion: 0,
            HookOn: '00'.repeat(32),
            HookNamespace: '00'.repeat(32),
          },
        },
      ],
    }
    await testTransaction(testContext.client, setHookTx, genesisWallet)
  })

  afterEach(async () => {
    // reset Hook
    const setHookTx: SetHook = {
      TransactionType: 'SetHook',
      Account: genesisWallet.classicAddress,
      Hooks: [
        {
          Hook: {
            CreateCode: '',
            Flags: { hsfOverride: true },
          },
        },
      ],
    }
    await testTransaction(testContext.client, setHookTx, genesisWallet)

    await teardownClient(testContext)
  })

  it(
    'opt in',
    async () => {
      const tx: ClaimReward = {
        TransactionType: 'ClaimReward',
        Account: testContext.wallet.classicAddress,
        Issuer: genesisWallet.address,
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
