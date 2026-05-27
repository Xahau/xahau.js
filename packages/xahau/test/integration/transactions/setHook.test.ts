import { SetHook } from '../../../src'
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
  '0061736D0100000001130360027F7F017F60037F7F7E017E60017F017E02170203656E76025F67000003656E760661636365707400010302010205030100020621057F01418088040B7F004180080B7F004180080B7F00418088040B7F004180080B07080104686F6F6B00020A9D80000199800000410141011080808080001A4100410042001081808080000B'

describe('SetHook', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      const wallet = await generateFundedWallet(testContext.client)
      const setHookTx: SetHook = {
        TransactionType: 'SetHook',
        Account: wallet.classicAddress,
        Hooks: [
          {
            Hook: {
              CreateCode: acceptHook,
              HookApiVersion: 0,
              HookOn: '00'.repeat(32),
              HookCanEmit: '00'.repeat(32),
              HookName: '484F4F4B',
              HookParameters: [
                {
                  HookParameter: {
                    HookParameterName: 'DEADBEEF',
                    HookParameterValue: 'DEADBEEF',
                  },
                },
              ],
              HookNamespace: '00'.repeat(32),
            },
          },
        ],
      }
      await testTransaction(testContext.client, setHookTx, wallet)
    },
    TIMEOUT,
  )
})
