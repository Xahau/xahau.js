import { Amount } from '../common'

import { BaseLedgerEntry, HasPreviousTxnID } from './BaseLedgerEntry'

/**
 * The URIToken object type contains the
 *
 * @category Ledger Entries
 */
export default interface URIToken extends BaseLedgerEntry, HasPreviousTxnID {
  LedgerEntryType: 'URIToken'

  /**
   */
  Owner: string

  /**
   * A hint indicating which page of the sender's owner directory links to this
   * object, in case the directory consists of multiple pages.
   */
  OwnerNode: string

  /**
   */
  Issuer: string

  /**
   */
  URI: string

  /**
   */
  Digest: string

  /**
   */
  Amount: Amount

  /**
   */
  Destination: string
}
