import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

/**
 * What the transactions on another network pay, as proven by `Ingest`
 * (Export amendment). There is one per network.
 *
 * @category Ledger Entries
 */
export default interface ExportFee extends BaseLedgerEntry, HasPreviousTxnID {
  LedgerEntryType: 'ExportFee'
  /** The other network. */
  RemoteNetworkID: number
  /**
   * The drops per signature that an export is priced by for a Hook that sets
   * no Fee.
   */
  ExportFeeUnit: number
  /** The index of the latest ledger proven. */
  LedgerSequence: number
  /** The number of transactions in that ledger. */
  TransactionCount: number
  /** The drops that those transactions burned between them, as a hex string (UInt64). */
  BurnedDrops: string
  /** The median fee unit sampled among those transactions. */
  SampleFee: number
}
