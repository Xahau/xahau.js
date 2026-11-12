const { encode, decode, encodeForSigning } = require('../src')

const blob =
  '120000210000535924000000003060000000C563D7BFA96140000000000003E86840000000000000647321EDF8BC5D1F837D187BF0DCE1286717BA9BF6BCFBEE02F7075CB237BF5DA66F7DB374400D5917B8E36B516DD92E7510CE096E5EB835B2ED655B04512627FFDD70E6D3161E66CA370178DE464B1F298B5633A1B2525A6C2DE9A0DA0D10873B76F9F14406705F1601001E01D00160015D1E011E13017C54013D2000017D811448AE4C18977228A8D7CB29DC5489883C2AEDEB438314193E704244837810A7805D8E5C851BD0E6C9BBB5'

const txJson = {
  Account: 'rfdJTUR1s1DMki9X6Ps3ZBo9uSF5DVwxEe',
  Amount: '1000',
  Destination: 'rsJ76amxeskjnwJeLzgzbBBLmTDsusEtVg',
  Fee: '100',
  JsonTxDelta: '01001E01D00160015D1E011E13017C54013D2000017D',
  NetworkID: 21337,
  Sequence: 0,
  SigningPubKey:
    'EDF8BC5D1F837D187BF0DCE1286717BA9BF6BCFBEE02F7075CB237BF5DA66F7DB3',
  Time: 'c563d7bfa9',
  TransactionType: 'Payment',
  TxnSignature:
    '0D5917B8E36B516DD92E7510CE096E5EB835B2ED655B04512627FFDD70E6D3161E66CA370178DE464B1F298B5633A1B2525A6C2DE9A0DA0D10873B76F9F14406',
}

describe('JsonTx amendment fields', function () {
  it('LastTxnTime has the expected field ID', function () {
    expect(encode({ LastTxnTime: 'c563d7bfa9' })).toBe('305F000000C563D7BFA9')
  })

  it('Time has the expected field ID', function () {
    expect(encode({ Time: 'c563d7bfa9' })).toBe('3060000000C563D7BFA9')
  })

  it('JsonTxDelta has the expected field ID', function () {
    expect(encode({ JsonTxDelta: 'ABCD' })).toBe('705F02ABCD')
  })

  it('encodes a transaction returned by xahaud', function () {
    expect(encode(txJson)).toBe(blob)
  })

  it('decodes a transaction returned by xahaud', function () {
    expect(decode(blob)).toEqual({ ...txJson, Time: '000000C563D7BFA9' })
  })

  it('does not sign JsonTxDelta', function () {
    expect(encode(txJson)).toContain('705F16')
    expect(encodeForSigning(txJson)).not.toContain('705F16')
  })
})
