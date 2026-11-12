import { assert } from 'chai'

import {
  ExportInfoAccountResult,
  ExportInfoCommon,
  ExportInfoOverviewResult,
  ExportInfoRequest,
  ExportInfoResponse,
} from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { generateFundedWallet } from '../utils'

// how long before each test case times out
const TIMEOUT = 20000

describe('export_info', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'overview',
    async () => {
      const request: ExportInfoRequest = {
        command: 'export_info',
        ledger_index: 'validated',
      }
      const response: ExportInfoResponse =
        await testContext.client.request(request)
      assert.equal(response.type, 'response')
      const result = response.result as ExportInfoCommon &
        ExportInfoOverviewResult

      assert.equal(result.enabled, true)
      assert.equal(result.network_id, 21337)
      // two networks' keys would make it ambiguous: here they are all the XRPL's
      assert.equal(result.default_network_id, 0)
      assert.equal(result.validated, true)

      // a standalone node has no validators, so no export keys
      assert.deepEqual(result.validators, [])
      assert.deepEqual(result.pending, [])
      assert.deepEqual(result.exporters, [])
      assert.equal(result.exporters_listed, 0)
      assert.isUndefined(result.marker)
      assert.sameMembers(Object.keys(result.keys), [
        'epoch',
        'epoch_ends',
        'export_keys_seq',
        'max_keys',
        'max_keys_per_epoch',
        'quorum',
        'refresh_every',
        'rotated_this_epoch',
        'rotation_period',
        'signers',
        'validators',
        'with_key',
      ])
      Object.values(result.keys).forEach((value) => assert.isNumber(value))
      assert.equal(result.keys.validators, 0)
      assert.equal(result.keys.signers, 0)

      // the XRPL, with the VL keys of .ci-config/validators.txt
      const xrpl = result.networks.find((network) => network.network_id === 0)
      assert.exists(xrpl)
      assert.equal(xrpl?.vl_keys, 2)
    },
    TIMEOUT,
  )

  it(
    'account',
    async () => {
      const wallet = await generateFundedWallet(testContext.client)
      const request: ExportInfoRequest = {
        command: 'export_info',
        account: wallet.classicAddress,
        ledger_index: 'validated',
      }
      const response: ExportInfoResponse =
        await testContext.client.request(request)
      assert.equal(response.type, 'response')
      const result = response.result as ExportInfoCommon &
        ExportInfoAccountResult

      assert.equal(result.enabled, true)
      assert.equal(result.network_id, 21337)
      assert.equal(result.default_network_id, 0)
      assert.isArray(result.records)
      assert.lengthOf(result.records, 0)
      // the overview members are not part of this form
      assert.notProperty(result, 'keys')
      assert.notProperty(result, 'exporters')
    },
    TIMEOUT,
  )
})
