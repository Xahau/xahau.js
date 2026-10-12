import { assert } from 'chai'

import { type HookValidateRequest } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'

// how long before each test case times out
const TIMEOUT = 20000
const acceptHook =
  '0061736D0100000001130360027F7F017F60037F7F7E017E60017F017E02170203656E76025F67000003656E760661636365707400010302010205030100020621057F01418088040B7F004180080B7F004180080B7F00418088040B7F004180080B07080104686F6F6B00020A9D80000199800000410141011080808080001A4100410042001081808080000B'

describe('hook_validate', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'valid hook',
    async () => {
      const request: HookValidateRequest = {
        command: 'hook_validate',
        code: acceptHook,
      }
      const response = await testContext.client.request(request)
      assert.equal(response.type, 'response')
      assert.equal(response.result.valid, true)
      assert.typeOf(response.result.instruction_count_hook, 'string')
      assert.typeOf(response.result.log, 'array')
    },
    TIMEOUT,
  )

  it(
    'invalid hook',
    async () => {
      const request: HookValidateRequest = {
        command: 'hook_validate',
        code: '00',
      }
      const response = await testContext.client.request(request)
      assert.equal(response.type, 'response')
      assert.equal(response.result.valid, false)
      assert.isNotEmpty(response.result.log)
    },
    TIMEOUT,
  )
})
