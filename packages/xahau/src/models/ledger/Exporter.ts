import { SignerEntry } from '../common'

import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

interface ExportSignerList {
  SignerQuorum: number
  SignerEntries: SignerEntry[]
  /** The ledger on the other network of the SignerListSet that set this list. */
  LedgerSequence: number
  /** The index in that ledger of the SignerListSet that set this list. */
  TransactionIndex: number
}

/**
 * An account's standing on one other network (Export amendment): its signer
 * list there, unused tickets, ticket watermark, Sequence and XRP balance (with
 * the ledger and index there it was proven at), all as last proven by Import.
 *
 * @category Ledger Entries
 */
export default interface Exporter extends BaseLedgerEntry, HasPreviousTxnID {
  LedgerEntryType: 'Exporter'
  /** The exporting account. */
  Account: string
  /** The other network. */
  RemoteNetworkID: number
  /** The account's signer list on the other network. */
  ExportSignerList?: ExportSignerList
  /**
   * The unused tickets on the other network, packed as ranges: each 256-bit
   * element holds up to six ranges of a big-endian uint32 first ticket and a
   * uint8 count, with the last 16 bits zero.
   */
  ExportTickets?: string[]
  /** The ticket watermark. */
  ExportTicketNext?: number
  /** The account's Sequence on the other network. */
  ExportSequence?: number
  /** The ticket or Sequence of an automatic TicketCreate that is still out. */
  ExportTicketPending?: number
  /** The `ExportKeysSeq` of the UNLReport that the signer list was built for. */
  ExportKeysSeq?: number
  /** The shadow tickets of the exports in flight. */
  Indexes?: string[]
  /** The account's XRP balance on the other network, in drops. */
  Balance?: string
  /** The ledger on the other network that the balance and Sequence were proven at. */
  LedgerSequence?: number
  /** The index in that ledger that they were proven at. */
  TransactionIndex?: number
  /** A hint indicating which page of the exporter directory links to this object. */
  ExportNode?: string
  /**
   * A hint indicating which page of the owner directory links to this object,
   * in case the directory consists of multiple pages.
   */
  OwnerNode: string
}
