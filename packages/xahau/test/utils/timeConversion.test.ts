import { assert } from 'chai'

import {
  rippleTimeToISOTime,
  isoTimeToRippleTime,
  unixTimeToRippleTime,
  rippleTimeToUnixTime,
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
})
