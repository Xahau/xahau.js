import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

/**
 *
 *
 *
 * @category Ledger Entries
 */
export default interface ImportVLSequence
  extends BaseLedgerEntry,
    HasPreviousTxnID {
  LedgerEntryType: 'ImportVLSequence'
  /**
   *
   */
  PublicKey: string
  /**
   *
   */
  ImportSequence: string
}
