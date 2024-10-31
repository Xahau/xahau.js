import { BaseLedgerEntry } from './BaseLedgerEntry'

/**
 *
 *
 *
 * @category Ledger Entries
 */
export default interface ImportVLSequence extends BaseLedgerEntry {
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
