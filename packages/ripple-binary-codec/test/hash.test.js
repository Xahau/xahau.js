const { coreTypes } = require('../src/types')
const { Hash128, Hash160, Hash256, AccountID, Currency } = coreTypes
const { Buffer } = require('buffer/')

describe('Hash128', function () {
  test('has a static width member', function () {
    expect(Hash128.width).toBe(16)
  })
  test('can be unset', function () {
    const h1 = Hash128.from('')
    expect(h1.toJSON()).toBe('')
  })
  test('can be compared against another', function () {
    const h1 = Hash128.from('100000000000000000000000000000000')
    const h2 = Hash128.from('200000000000000000000000000000000')
    const h3 = Hash128.from('000000000000000000000000000000003')
    expect(h1.lt(h2)).toBe(true)
    expect(h3.lt(h2)).toBe(true)
    expect(h2.gt(h1)).toBe(true)
    expect(h1.gt(h3)).toBe(true)
  })
  test('throws when constructed from invalid hash length', () => {
    expect(() => Hash128.from('1000000000000000000000000000000')).toThrow(
      'Invalid Hash length 15',
    )
    expect(() => Hash128.from('10000000000000000000000000000000000')).toThrow(
      'Invalid Hash length 17',
    )
  })
})
describe('Hash160', function () {
  test('has a static width member', function () {
    expect(Hash160.width).toBe(20)
  })
  test('inherited by subclasses', function () {
    expect(AccountID.width).toBe(20)
    expect(Currency.width).toBe(20)
  })
  test('can be compared against another', function () {
    const h1 = Hash160.from('1000000000000000000000000000000000000000')
    const h2 = Hash160.from('2000000000000000000000000000000000000000')
    const h3 = Hash160.from('0000000000000000000000000000000000000003')
    expect(h1.lt(h2)).toBe(true)
    expect(h3.lt(h2)).toBe(true)
  })
  test('throws when constructed from invalid hash length', () => {
    expect(() =>
      Hash160.from('10000000000000000000000000000000000000'),
    ).toThrow('Invalid Hash length 19')
    expect(() =>
      Hash160.from('100000000000000000000000000000000000000000'),
    ).toThrow('Invalid Hash length 21')
  })
})

describe('Hash256', function () {
  test('has a static width member', function () {
    expect(Hash256.width).toBe(32)
  })
  test('has a ZERO_256 member', function () {
    expect(Hash256.ZERO_256.toJSON()).toBe(
      '0000000000000000000000000000000000000000000000000000000000000000',
    )
  })
  test('supports getting the nibblet values at given positions', function () {
    const h = Hash256.from(
      '1359BD0000000000000000000000000000000000000000000000000000000000',
    )
    expect(h.nibblet(0)).toBe(0x1)
    expect(h.nibblet(1)).toBe(0x3)
    expect(h.nibblet(2)).toBe(0x5)
    expect(h.nibblet(3)).toBe(0x9)
    expect(h.nibblet(4)).toBe(0x0b)
    expect(h.nibblet(5)).toBe(0xd)
  })
})

describe('Currency', function () {
  test('Decoding allows dodgy XRP without throwing', function () {
    const currencyCode = '0000000000000000000000005841480000000000'
    expect(Currency.from(currencyCode).toJSON()).toBe(currencyCode)
  })
  test('Currency code with lowercase letters decodes to ISO code', () => {
    expect(Currency.from('xRp').toJSON()).toBe('xRp')
  })
  test('Currency codes with symbols decodes to ISO code', () => {
    expect(Currency.from('x|p').toJSON()).toBe('x|p')
  })
  test('Currency code with non-standard symbols decodes to hex', () => {
    expect(Currency.from(':::').toJSON()).toBe(
      '0000000000000000000000003A3A3A0000000000',
    )
  })
  test('Currency codes can be exclusively standard symbols', () => {
    expect(Currency.from('![]').toJSON()).toBe('![]')
  })
  test('Currency codes with uppercase and 0-9 decode to ISO codes', () => {
    expect(Currency.from('X8P').toJSON()).toBe('X8P')
    expect(Currency.from('USD').toJSON()).toBe('USD')
  })

  test('Currency codes with no contiguous zeroes in first 96 type code & reserved bits', function () {
    expect(
      Currency.from('0000000023410000000000005852520000000000').iso(),
    ).toBe(null)
  })

  test('Currency codes with no contiguous zeroes in last 40 reserved bits', function () {
    expect(
      Currency.from('0000000000000000000000005852527570656500').iso(),
    ).toBe(null)
  })

  test('can be constructed from a Buffer', function () {
    const xrp = new Currency(Buffer.alloc(20))
    expect(xrp.iso()).toBe('XAH')
  })
  test('Can handle non-standard currency codes', () => {
    const currency = '015841551A748AD2C1F76FF6ECB0CCCD00000000'
    expect(Currency.from(currency).toJSON()).toBe(currency)
  })

  test('Can handle other non-standard currency codes', () => {
    const currency = '0000000000414C6F676F30330000000000000000'
    expect(Currency.from(currency).toJSON()).toBe(currency)
  })

  test('throws on invalid reprs', function () {
    expect(() => Currency.from(Buffer.alloc(19))).toThrow()
    expect(() => Currency.from(1)).toThrow()
    expect(() =>
      Currency.from('00000000000000000000000000000000000000m'),
    ).toThrow()
  })
})
