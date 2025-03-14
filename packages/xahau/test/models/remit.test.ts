import { assert } from 'chai'

import { validate, ValidationError } from '../../src'
import { validateRemit } from '../../src/models/transactions/remit'

/**
 * Remit Verification Testing.
 *
 * Providing runtime verification testing for each specific transaction type.
 */

// eslint-disable-next-line max-statements -- ignore
describe('Remit', function () {
  let remit

  beforeEach(function () {
    remit = {
      TransactionType: 'Remit',
      Account: 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo',
      Destination: 'rfkE1aSy9G8Upk4JssnwBxhEv5p4mn2KTy',
      DestinationTag: 1,
      Fee: '12',
      Flags: 0,
      LastLedgerSequence: 65953073,
      Sequence: 65923914,
      SigningPubKey:
        '02F9E33F16DF9507705EC954E3F94EB5F10D1FC4A354606DBE6297DBB1096FE654',
      TxnSignature:
        '3045022100E3FAE0EDEC3D6A8FF6D81BC9CF8288A61B7EEDE8071E90FF9314CB4621058D10022043545CF631706D700CEE65A1DB83EFDD185413808292D9D90F14D87D3DC2D8CB',
      Amounts: [
        { AmountEntry: { Amount: '1000' } },
        {
          AmountEntry: {
            Amount: {
              currency: 'USD',
              issuer: 'rcXY84C4g14iFp6taFXjjQGVeHqSCh9RX',
              value: '1',
            },
          },
        },
      ],
      MintURIToken: {
        URI: 'DEADBEEF',
        Digest:
          '6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B',
        Flags: 1,
      },
      URITokenIDs: [
        'AED08CC1F50DD5F23A1948AF86153A3F3B7593E5EC77D65A02BB1B29E05AB6AE',
      ],
      InvoiceID:
        '6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B',
      Blob: 'DEADBEEF',
      Inform: 'rB5Ux4Lv2nRx6eeoAAsZmtctnBQ2LiACnk',
    } as any
  })

  it(`verifies valid Remit`, function () {
    assert.doesNotThrow(() => validateRemit(remit))
    assert.doesNotThrow(() => validate(remit))
  })

  it(`throws w/ Bad Amounts`, function () {
    remit.Amounts = {}
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: Amounts must be an array',
    )
  })
  it(`throws w/ Empty Amounts`, function () {
    remit.Amounts = []
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: empty field Amounts',
    )
  })
  it(`throws w/ Max Amounts`, function () {
    remit.Amounts = [
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
    ]
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: max field Amounts',
    )
  })
  it(`throws w/ Duplicate native amounts`, function () {
    remit.Amounts = [
      { AmountEntry: { Amount: '1000' } },
      { AmountEntry: { Amount: '1000' } },
    ]
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: Duplicate Native amounts are not allowed',
    )
  })
  it(`throws w/ Duplicate amounts`, function () {
    remit.Amounts = [
      {
        AmountEntry: {
          Amount: {
            currency: 'USD',
            issuer: 'rcXY84C4g14iFp6taFXjjQGVeHqSCh9RX',
            value: '1',
          },
        },
      },
      {
        AmountEntry: {
          Amount: {
            currency: 'USD',
            issuer: 'rcXY84C4g14iFp6taFXjjQGVeHqSCh9RX',
            value: '1',
          },
        },
      },
    ]
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: Duplicate amounts are not allowed',
    )
  })
  it(`throws w/ Bad URITokenIDs`, function () {
    remit.URITokenIDs = {}
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: invalid field URITokenIDs',
    )
  })
  it(`throws w/ Empty URITokenIDs`, function () {
    remit.URITokenIDs = []
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: empty field URITokenIDs',
    )
  })
  it(`throws w/ Empty URITokenIDs`, function () {
    remit.URITokenIDs = [
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
      'DEADBEEF',
    ]
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: max field URITokenIDs',
    )
  })
  it(`throws w/ Invalid URITokenID`, function () {
    remit.URITokenIDs = [1]
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: URITokenID must be a hex string',
    )
  })
  it(`throws w/ Invalid URITokenID`, function () {
    remit.URITokenIDs = ['ZZ11']
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: URITokenID must be a hex string',
    )
  })
  it(`throws w/ Duplicate URITokenIDs`, function () {
    remit.URITokenIDs = ['DEADBEEF']
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: URITokenID must be exactly 64 characters',
    )
  })
  it(`throws w/ Duplicate URITokenIDs`, function () {
    remit.URITokenIDs = [
      'AED08CC1F50DD5F23A1948AF86153A3F3B7593E5EC77D65A02BB1B29E05AB6AE',
      'AED08CC1F50DD5F23A1948AF86153A3F3B7593E5EC77D65A02BB1B29E05AB6AE',
    ]
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: Duplicate URITokens are not allowed',
    )
  })
  // it(`throws w/ Bad MintURIToken`, function () {
  //   remit.MintURIToken = []
  //   assert.throws(
  //     () => validateRemit(remit),
  //     ValidationError,
  //     'Remit: invalid MintURIToken',
  //   )
  // })
  it(`throws w/ Missing MintURIToken.URI`, function () {
    remit.MintURIToken = {}
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: missing field MintURIToken.URI',
    )
  })
  it(`throws w/ Bad MintURIToken.URI`, function () {
    remit.MintURIToken = {
      URI: 1,
    }
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: MintURIToken.URI must be a hex string',
    )
  })
  it(`throws w/ Bad MintURIToken.URI`, function () {
    remit.MintURIToken = {
      URI: 'ZZ11',
    }
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: MintURIToken.URI must be a hex string',
    )
  })
  it(`throws w/ Bad MintURIToken Less than 1`, function () {
    remit.MintURIToken = {
      URI: '',
    }
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: MintURIToken.URI must be a hex string',
    )
  })
  it(`throws w/ Bad MintURIToken.Digest`, function () {
    remit.MintURIToken = {
      URI: 'DEADBEEF',
      Digest: 1,
    }
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: MintURIToken.Digest must be a string',
    )
  })
  it(`throws w/ Bad MintURIToken.Digest`, function () {
    remit.MintURIToken = {
      URI: 'DEADBEEF',
      Digest: 'ZZ11',
    }
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: Digest must be exactly 64 characters',
    )
  })
  it(`throws w/ Bad Destination`, function () {
    remit.Destination = 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo'
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: Destination must not be equal to the account',
    )
  })
  it(`throws w/ Bad Destination Tag`, function () {
    remit.DestinationTag = '1'
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: DestinationTag must be a number',
    )
  })
  it(`throws w/ Bad Inform`, function () {
    remit.Inform = 'rUn84CUYbNjRoTQ6mSW7BVJPSVJNLb1QLo'
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: Inform must not be equal to the account or destination',
    )
  })
  it(`throws w/ Bad Blob Type`, function () {
    remit.Blob = 1
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: Blob must be a string',
    )
  })
  it(`throws w/ Bad Blob Not Hex`, function () {
    remit.Blob = 'ZZ11'
    assert.throws(
      () => validateRemit(remit),
      ValidationError,
      'Remit: Blob must be a hex string',
    )
  })
})
