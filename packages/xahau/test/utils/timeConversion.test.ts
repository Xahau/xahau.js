import { assert } from 'chai'

import {
  rippleTimeToISOTime,
  isoTimeToRippleTime,
  unixTimeToRippleTime,
  rippleTimeToUnixTime,
  unixTimeToTransactionTime,
  transactionTimeToUnixTime,
} from '../../src'

describe('time conversion', function () {
  describe('rippleTimeToISOTime', function () {
    it('converts xahau time to ISO time', function () {
      const xahauTime = 0
      const isoTime = '2000-01-01T00:00:00.000Z'
      assert.equal(rippleTimeToISOTime(xahauTime), isoTime)
    })
  })

  describe('isoTimeToRippleTime', function () {
    it('converts ISO time to xahau time', function () {
      const xahauTime = 0
      const isoTime = '2000-01-01T00:00:00.000Z'
      assert.equal(isoTimeToRippleTime(isoTime), xahauTime)
    })

    it('converts from Date', function () {
      const xahauTime = 0
      const isoTime = '2000-01-01T00:00:00.000Z'
      assert.equal(isoTimeToRippleTime(new Date(isoTime)), xahauTime)
    })
  })

  describe('unixTimeToRippleTime', function () {
    it('converts unix time to xahau time', function () {
      const unixTime = 946684801000
      const xahauTime = 1
      assert.equal(unixTimeToRippleTime(unixTime), xahauTime)
    })
  })

  describe('rippleTimeToUnixTime', function () {
    it('converts xahau time to unix time', function () {
      const unixTime = 946684801000
      const xahauTime = 1
      assert.equal(rippleTimeToUnixTime(xahauTime), unixTime)
    })
  })

  describe('transactionTimeToUnixTime', function () {
    it('converts a transaction Time to unix time', function () {
      assert.equal(
        transactionTimeToUnixTime('c563d7bfa9'),
        0xc563d7bfa9 + 946684800000,
      )
      assert.equal(transactionTimeToUnixTime('0'), 946684800000)
    })
  })

  describe('unixTimeToTransactionTime', function () {
    it('converts unix time to a lowercase hex transaction Time', function () {
      assert.equal(
        unixTimeToTransactionTime(0xc563d7bfa9 + 946684800000),
        'c563d7bfa9',
      )
      assert.equal(unixTimeToTransactionTime(946684800000), '0')
    })

    it('round trips', function () {
      const unixTime = 1794468442345
      assert.equal(
        transactionTimeToUnixTime(unixTimeToTransactionTime(unixTime)),
        unixTime,
      )
    })
  })
})
