import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

/**
 * The AppLoader object holds the HTML document an account publishes for its
 * PWA loader. There is at most one per account.
 *
 * @category Ledger Entries
 */
export default interface AppLoader extends BaseLedgerEntry, HasPreviousTxnID {
  LedgerEntryType: 'AppLoader'

  /** The account that owns this object. */
  Owner: string

  /** The hex-encoded HTML document. */
  AppLoader: string

  /** The sequence of the AccountSet that last set the document. */
  AppLoaderSequence: number
}
