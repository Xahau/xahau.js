import { SetHook } from '../../../src'
import { Hook, HookDefinition } from '../../../src/models/ledger'
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

      const ledgerEntryResponse = await testContext.client.request({
        command: 'ledger_entry',
        hook: { account: wallet.classicAddress },
      })
      const node = ledgerEntryResponse.result.node as Hook
      expect(node.Hooks.length).toEqual(1)
      const hook = node.Hooks[0].Hook
      expect(Object.keys(hook).length).toEqual(1)
      expect(hook.HookHash).toBeDefined()
      const hookHash = hook.HookHash!

      const hookDefinitionResponse = await testContext.client.request({
        command: 'ledger_entry',
        hook_definition: hookHash,
      })
      const hookDefinitionNode = hookDefinitionResponse.result
        .node as HookDefinition
      expect(hookDefinitionNode.HookHash).toEqual(hookHash)
      expect(hookDefinitionNode.CreateCode).toEqual(acceptHook)
      expect(hookDefinitionNode.HookApiVersion).toEqual(0)
      expect(hookDefinitionNode.HookOn).toEqual('00'.repeat(32))
      expect(hookDefinitionNode.HookNamespace).toEqual('00'.repeat(32))
      expect(hookDefinitionNode.HookParameters?.length).toEqual(1)
      const parameter = hookDefinitionNode.HookParameters![0].HookParameter
      expect(parameter.HookParameterName).toEqual('DEADBEEF')
      expect(parameter.HookParameterValue).toEqual('DEADBEEF')
    },
    TIMEOUT,
  )
})
