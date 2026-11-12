import { ExportedTxn } from '../transactions/export'

import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

/**
 * A shadow ticket lets the XPOP of whatever uses one ticket on another
 * network be imported once, which consumes it (Export amendment). Only an
 * export creates one. Once signed at quorum the transaction is kept in
 * `ExportedTxn` for relays to send.
 *
 * @category Ledger Entries
 */
export default interface ShadowTicket
  extends BaseLedgerEntry, HasPreviousTxnID {
  LedgerEntryType: 'ShadowTicket'
  /** The exporting account. */
  Account: string
  /** The network the ticket is for. */
  RemoteNetworkID: number
  /** The ticket sequence number on the other network. */
  TicketSequence: number
  /**
   * The export's id on the other network without signatures, which tells it
   * from anything else that used the ticket.
   */
  TransactionHash: string
  /** The hash of the Hook to call back about the export. */
  EmitHookHash?: string
  /** The export's own LastLedgerSequence on the other network, after which it is expired. */
  LastLedgerSequence?: number
  /** The id of the Export transaction that made this ticket. */
  ExportTxnID?: string
  /** The id on the other network of the signed transaction. */
  RemoteTxnID?: string
  /** The signed transaction, once it reached quorum. */
  ExportedTxn?: ExportedTxn
  /**
   * A hint indicating which page of the owner directory links to this object,
   * in case the directory consists of multiple pages.
   */
  OwnerNode: string
}
