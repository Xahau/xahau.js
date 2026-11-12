import { assert } from 'chai'

import {
  ExportInfoCommon,
  ExportInfoOverviewResult,
  Ingest,
  LedgerEntryRequest,
} from '../../../src'
import { ExportFee } from '../../../src/models/ledger'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import { generateFundedWallet, testTransaction } from '../utils'
import { forgeXpof } from '../xpof'

// how long before each test case times out
const TIMEOUT = 20000

describe('Ingest', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'base',
    async () => {
      // the proof of ledger 1,000,000 of the XRPL, as signed by a VL
      // publisher that the node trusts (.ci-config/validators.txt)
      const xpof = forgeXpof(1_000_000)
      const wallet = await generateFundedWallet(testContext.client)
      const tx: Ingest = {
        TransactionType: 'Ingest',
        Account: wallet.classicAddress,
        RemoteNetworkID: 0,
        LedgerSequence: xpof.ledgerSequence,
        Blob: xpof.blob,
      }
      await testTransaction(testContext.client, tx, wallet)

      const request: LedgerEntryRequest = {
        command: 'ledger_entry',
        export_fee: { network_id: 0 },
        ledger_index: 'validated',
      }
      const entry = await testContext.client.request(request)
      const node = entry.result.node as ExportFee
      assert.equal(node.LedgerEntryType, 'ExportFee')
      assert.equal(node.RemoteNetworkID, 0)
      assert.equal(node.LedgerSequence, xpof.ledgerSequence)
      assert.equal(node.TransactionCount, xpof.transactions)
      assert.equal(Number(`0x${node.BurnedDrops}`), xpof.burnedDrops)
      assert.equal(node.SampleFee, xpof.sampleFee)
      // the first ledger proven of a network is the unit itself
      assert.equal(node.ExportFeeUnit, xpof.sampleFee)

      const info = await testContext.client.request({
        command: 'export_info',
        ledger_index: 'validated',
      })
      const network = (
        info.result as ExportInfoCommon & ExportInfoOverviewResult
      ).networks.find((each) => each.network_id === 0)
      assert.deepEqual(network, {
        network_id: 0,
        vl_keys: 2,
        ledger_index: xpof.ledgerSequence,
        fee_unit: xpof.sampleFee,
        sample_fee: xpof.sampleFee,
        transactions: xpof.transactions,
      })
    },
    TIMEOUT,
  )
})
