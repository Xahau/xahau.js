import { assert } from 'chai'

import { EscrowFinish, EscrowCreate } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'
import {
  calculateWaitTimeForTransaction,
  getXRPBalance,
  testTransaction,
} from '../utils'

// how long before each test case times out
const TIMEOUT = 30000

describe('EscrowFinish', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl, true)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'test xrp',
    async () => {
      // get the most recent close_time from the standalone container for cancel & finish after.
      const CLOSE_TIME: number = (
        await testContext.client.request({
          command: 'ledger',
          ledger_index: 'validated',
        })
      ).result.ledger.close_time

      const waitTimeInMs = calculateWaitTimeForTransaction(CLOSE_TIME)

      const createTx: EscrowCreate = {
        Account: testContext.wallet.classicAddress,
        TransactionType: 'EscrowCreate',
        Amount: '10000',
        Destination: testContext.destination.classicAddress,
        FinishAfter: CLOSE_TIME + 2,
      }

      const finishAfterPromise = new Promise((resolve) => {
        setTimeout(resolve, waitTimeInMs)
      })

      await testTransaction(testContext.client, createTx, testContext.wallet)

      const initialBalance = await getXRPBalance(
        testContext.client,
        testContext.destination,
      )

      // check that the object was actually created
      const accountObjects = (
        await testContext.client.request({
          command: 'account_objects',
          account: testContext.wallet.classicAddress,
        })
      ).result.account_objects

      assert.equal(accountObjects.length, 2)

      const sequence = (
        await testContext.client.request({
          command: 'tx',
          transaction: accountObjects[1].PreviousTxnID,
        })
      ).result.Sequence

      const finishTx: EscrowFinish = {
        TransactionType: 'EscrowFinish',
        Account: testContext.wallet.classicAddress,
        Owner: testContext.wallet.classicAddress,
        OfferSequence: sequence!,
      }

      await finishAfterPromise

      await testTransaction(testContext.client, finishTx, testContext.wallet)

      const expectedBalance = String(Number(initialBalance) + Number('10000'))
      assert.equal(
        await getXRPBalance(testContext.client, testContext.destination),
        expectedBalance,
      )
    },
    TIMEOUT,
  )
  it(
    'test token',
    async () => {
      // get the most recent close_time from the standalone container for cancel & finish after.
      const CLOSE_TIME: number = (
        await testContext.client.request({
          command: 'ledger',
          ledger_index: 'validated',
        })
      ).result.ledger.close_time

      const waitTimeInMs = calculateWaitTimeForTransaction(CLOSE_TIME)

      const createTx: EscrowCreate = {
        Account: testContext.wallet.classicAddress,
        TransactionType: 'EscrowCreate',
        Amount: {
          currency: 'USD',
          issuer: testContext.gateway.classicAddress,
          value: '100',
        },
        Destination: testContext.destination.classicAddress,
        FinishAfter: CLOSE_TIME + 2,
      }

      const finishAfterPromise = new Promise((resolve) => {
        setTimeout(resolve, waitTimeInMs)
      })

      await testTransaction(testContext.client, createTx, testContext.wallet)

      const initialBalance = await getXRPBalance(
        testContext.client,
        testContext.destination,
      )

      // check that the object was actually created
      const accountObjects = (
        await testContext.client.request({
          command: 'account_objects',
          account: testContext.wallet.classicAddress,
        })
      ).result.account_objects

      assert.equal(accountObjects.length, 2)

      const sequence = (
        await testContext.client.request({
          command: 'tx',
          transaction: accountObjects[1].PreviousTxnID,
        })
      ).result.Sequence

      const finishTx: EscrowFinish = {
        TransactionType: 'EscrowFinish',
        Account: testContext.wallet.classicAddress,
        Owner: testContext.wallet.classicAddress,
        OfferSequence: sequence!,
      }

      await finishAfterPromise

      await testTransaction(testContext.client, finishTx, testContext.wallet)

      const expectedBalance = String(Number(initialBalance))
      assert.equal(
        await getXRPBalance(testContext.client, testContext.destination),
        expectedBalance,
      )
    },
    TIMEOUT,
  )
})
