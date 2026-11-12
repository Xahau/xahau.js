import { encode, decode } from '../src'

const H1 = 'A'.repeat(64)
const H2 = 'B'.repeat(64)
const H3 = 'C'.repeat(64)
const ACCOUNT = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'
const ACCOUNT2 = 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe'
const PUBKEY =
  'ED5F5AC8B98974A3CA843326D9B88CEBD0560177B973EE0B149F782911D6B3C4AB'
const SIG = 'DEADBEEF'.repeat(8)

function roundTrip(json: Record<string, unknown>, prefix?: string): void {
  const hex = encode(json)
  if (prefix) {
    expect(hex.startsWith(prefix)).toBe(true)
  }
  expect(decode(hex)).toEqual(json)
}

describe('Export amendment', () => {
  it('Export with a multisigned ExportedTxn and EmitDetails', () => {
    roundTrip(
      {
        TransactionType: 'Export',
        Account: ACCOUNT,
        Sequence: 0,
        Fee: '10',
        SigningPubKey: '',
        FirstLedgerSequence: 5,
        LastLedgerSequence: 10,
        ExportedTxn: {
          TransactionType: 'Payment',
          Account: ACCOUNT2,
          Destination: ACCOUNT,
          Amount: '1000000',
          Sequence: 0,
          TicketSequence: 7,
          Fee: '120',
          NetworkID: 21337,
          OperationLimit: 21337,
          SigningPubKey: '',
          Signers: [
            {
              Signer: {
                Account: ACCOUNT,
                SigningPubKey: PUBKEY,
                TxnSignature: SIG,
              },
            },
          ],
        },
        EmitDetails: {
          EmitGeneration: 1,
          EmitBurden: '0000000000000001',
          EmitParentTxnID: H1,
          EmitNonce: H2,
          EmitHookHash: H3,
        },
      },
      '120058',
    )
  })

  it('ExportSign', () => {
    roundTrip(
      {
        TransactionType: 'ExportSign',
        Account: 'rrrrrrrrrrrrrrrrrrrrrhoLvTp',
        Sequence: 0,
        Fee: '0',
        SigningPubKey: '',
        LedgerSequence: 123,
        TransactionHash: H1,
        Signer: {
          Account: ACCOUNT,
          SigningPubKey: PUBKEY,
          TxnSignature: SIG,
        },
      },
      '120057',
    )
  })

  it('ExportFinal with and without LedgerIndex', () => {
    const base = {
      TransactionType: 'ExportFinal',
      Account: 'rrrrrrrrrrrrrrrrrrrrrhoLvTp',
      Sequence: 0,
      Fee: '0',
      SigningPubKey: '',
      Owner: ACCOUNT,
      LedgerSequence: 99,
      TransactionHash: H1,
    }
    roundTrip(base, '12005A')
    roundTrip({ ...base, LedgerIndex: H2 }, '12005A')
  })

  it('ExportAuto', () => {
    roundTrip(
      {
        TransactionType: 'ExportAuto',
        Account: 'rrrrrrrrrrrrrrrrrrrrrhoLvTp',
        Sequence: 0,
        Fee: '0',
        SigningPubKey: '',
        Owner: ACCOUNT,
        LedgerSequence: 99,
        ExportedTxn: {
          TransactionType: 'SignerListSet',
          Account: ACCOUNT,
          NetworkID: 21337,
          Sequence: 0,
          Fee: '12',
          SigningPubKey: '',
          SignerQuorum: 1,
          SignerEntries: [
            { SignerEntry: { Account: ACCOUNT2, SignerWeight: 1 } },
          ],
        },
      },
      '120056',
    )
  })

  it('Ingest', () => {
    roundTrip(
      {
        TransactionType: 'Ingest',
        Account: ACCOUNT,
        Sequence: 1,
        Fee: '10',
        SigningPubKey: '',
        RemoteNetworkID: 0,
        LedgerSequence: 1234,
        Blob: 'DEADBEEF',
      },
      '120055',
    )
  })

  it('ExportedTxn ledger entry', () => {
    roundTrip(
      {
        LedgerEntryType: 'ExportedTxn',
        Flags: 0,
        Owner: ACCOUNT,
        RemoteNetworkID: 0,
        ExportedTxn: {
          TransactionType: 'Payment',
          Account: ACCOUNT2,
          Destination: ACCOUNT,
          Amount: '1',
          Sequence: 0,
          Fee: '10',
          SigningPubKey: '',
        },
        TransactionHash: H1,
        LedgerSequence: 5,
        SignerEntries: [
          { SignerEntry: { Account: ACCOUNT2, SignerWeight: 1 } },
        ],
        SignerQuorum: 1,
        EmitHookHash: H2,
        ExportTxnID: H3,
      },
      '110058',
    )
  })

  it('ShadowTicket ledger entry', () => {
    roundTrip(
      {
        LedgerEntryType: 'ShadowTicket',
        Flags: 0,
        Account: ACCOUNT,
        RemoteNetworkID: 0,
        TicketSequence: 7,
        TransactionHash: H1,
        EmitHookHash: H2,
        LastLedgerSequence: 100,
        ExportTxnID: H3,
        RemoteTxnID: H1,
        ExportedTxn: {
          TransactionType: 'Payment',
          Account: ACCOUNT2,
          Destination: ACCOUNT,
          Amount: '1',
          Sequence: 0,
          Fee: '10',
          SigningPubKey: '',
        },
        OwnerNode: '0000000000000000',
        PreviousTxnID: H2,
        PreviousTxnLgrSeq: 4,
      },
      '110059',
    )
  })

  it('Exporter ledger entry', () => {
    roundTrip(
      {
        LedgerEntryType: 'Exporter',
        Flags: 0,
        Account: ACCOUNT,
        RemoteNetworkID: 0,
        ExportSignerList: {
          SignerQuorum: 2,
          SignerEntries: [
            { SignerEntry: { Account: ACCOUNT2, SignerWeight: 1 } },
            { SignerEntry: { Account: ACCOUNT, SignerWeight: 1 } },
          ],
          LedgerSequence: 10,
          TransactionIndex: 3,
        },
        ExportTickets: [H1, H2],
        ExportTicketNext: 9,
        ExportSequence: 4,
        ExportTicketPending: 8,
        ExportKeysSeq: 2,
        Indexes: [H2, H3],
        Balance: '1000000',
        LedgerSequence: 10,
        TransactionIndex: 3,
        ExportNode: '0000000000000001',
        OwnerNode: '0000000000000000',
        PreviousTxnID: H3,
        PreviousTxnLgrSeq: 4,
      },
      '110056',
    )
  })

  it('ExportFee ledger entry', () => {
    roundTrip(
      {
        LedgerEntryType: 'ExportFee',
        Flags: 0,
        RemoteNetworkID: 0,
        ExportFeeUnit: 10,
        LedgerSequence: 100,
        TransactionCount: 42,
        BurnedDrops: '00000000000F4240',
        SampleFee: 12,
        PreviousTxnID: H1,
        PreviousTxnLgrSeq: 4,
      },
      '11005A',
    )
  })

  it('AccountRoot with ExportKeys', () => {
    roundTrip(
      {
        LedgerEntryType: 'AccountRoot',
        Flags: 0,
        Account: ACCOUNT,
        Balance: '1000000',
        Sequence: 1,
        OwnerCount: 0,
        PreviousTxnID: H1,
        PreviousTxnLgrSeq: 4,
        ExportKeys: [
          { ExportKeyEntry: { ExportKey: PUBKEY, CloseTime: 700000000 } },
          { ExportKeyEntry: { ExportKey: PUBKEY, CloseTime: 600000000 } },
        ],
      },
      '110061',
    )
  })

  // Field IDs as serialized, written out from xahaud's sfields.macro
  // (type code and field code), so a wrong `nth` or `type` in
  // definitions.json fails here even though it would still round trip.
  const fieldIds: Array<[string, unknown, string]> = [
    ['RemoteNetworkID', 1, '2055'],
    ['TransactionCount', 1, '2056'],
    ['SampleFee', 1, '2057'],
    ['ExportFeeUnit', 1, '2058'],
    ['ExportSequence', 1, '2059'],
    ['ExportTicketPending', 1, '205A'],
    ['ExportTicketNext', 1, '205B'],
    ['ExportKeysSeq', 1, '205C'],
    ['BurnedDrops', '0000000000000001', '305D'],
    ['ExportNode', '0000000000000001', '305E'],
    ['ExportTxnID', H1, '505C'],
    ['RemoteTxnID', H1, '5064'],
    ['ExportKey', 'AB', '705D01'],
    ['ExportKeyProof', 'AB', '705E01'],
    ['ExportTickets', [H1], '071320'],
    ['ExportKeyEntry', { CloseTime: 1 }, 'E055'],
    ['ExportSignerList', { SignerQuorum: 1 }, 'E056'],
    ['ExportKeyReport', { PublicKey: PUBKEY }, 'E057'],
    ['ExportedTxn', { Sequence: 0 }, 'E059'],
    ['ExportKeys', [{ ExportKeyEntry: { CloseTime: 1 } }], 'F05AE055'],
  ]
  // a loop rather than it.each, which the browser (Jasmine) run does not have
  fieldIds.forEach(([field, value, prefix]) => {
    it(`${field} is serialized with its field ID`, () => {
      expect(encode({ [field]: value }).startsWith(prefix)).toBe(true)
    })
  })
})
