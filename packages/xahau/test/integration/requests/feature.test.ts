import { assert } from 'chai'

import { FeatureRequest } from '../../../src'
import serverUrl from '../serverUrl'
import {
  setupClient,
  teardownClient,
  type XrplIntegrationTestContext,
} from '../setup'

// how long before each test case times out
const TIMEOUT = 20000
const AMENDMENT =
  '0D8BF22FF7570D58598D1EF19EBB6E142AD46E59A223FD3816262FBB69345BEA'

describe('feature', function () {
  let testContext: XrplIntegrationTestContext

  beforeEach(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterEach(async () => teardownClient(testContext))

  it(
    'all',
    async () => {
      const featureRequest: FeatureRequest = {
        command: 'feature',
      }
      const featureResponse = await testContext.client.request(featureRequest)

      assert.equal(featureResponse.type, 'response')
      assert.typeOf(featureResponse.result.features, 'object')
      assert.isTrue(AMENDMENT in featureResponse.result.features)

      const amendmentData = featureResponse.result.features[AMENDMENT]
      assert.equal(amendmentData.name, 'Remit')
      // TODO: xahaud says "false" for standalone nodes for some reason
      assert.typeOf(amendmentData.enabled, 'boolean')
      assert.equal(amendmentData.supported, true)
    },
    TIMEOUT,
  )

  it(
    'one',
    async () => {
      const featureRequest: FeatureRequest = {
        command: 'feature',
        feature: AMENDMENT,
      }
      const featureResponse = await testContext.client.request(featureRequest)

      assert.equal(featureResponse.type, 'response')
      assert.typeOf(featureResponse.result, 'object')
      assert.isTrue(AMENDMENT in featureResponse.result)
      assert.lengthOf(Object.keys(featureResponse.result), 1)

      const amendmentData = featureResponse.result[AMENDMENT]

      assert.equal(amendmentData.name, 'Remit')
      // TODO: xahaud says "false" for standalone nodes for some reason
      assert.typeOf(amendmentData.enabled, 'boolean')
      assert.equal(amendmentData.supported, true)
    },
    TIMEOUT,
  )
})
