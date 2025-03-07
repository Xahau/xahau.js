import { LedgerIndex } from '../common'
import { LedgerEntry } from '../ledger'

import { BaseRequest, BaseResponse } from './baseMethod'

/**
 * The `ledger_entry` method returns a single ledger object from the XRP Ledger
 * in its raw format. Expects a response in the form of a {@link
 * LedgerEntryResponse}.
 *
 * @example
 * ```ts
 * const ledgerEntry: LedgerEntryRequest = {
 *   command: "ledger_entry",
 *   ledger_index: 60102302,
 *   index: "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4"
 * }
 * ```
 *
 * @category Requests
 */
export interface LedgerEntryRequest extends BaseRequest {
  command: 'ledger_entry'
  /**
   * If true, return the requested ledger object's contents as a hex string in
   * the XRP Ledger's binary format. Otherwise, return data in JSON format. The
   * default is false.
   */
  binary?: boolean
  /** A 20-byte hex string for the ledger version to use. */
  ledger_hash?: string
  /** The ledger index of the ledger to use, or a shortcut string. */
  ledger_index?: LedgerIndex

  /*
   * Only one of the following properties should be defined in a single request
   * https://xrpl.org/ledger_entry.html.
   *
   * Retrieve any type of ledger object by its unique ID.
   */
  index?: string

  /**
   * Retrieve an AccountRoot object by its address. This is roughly equivalent
   * to the an {@link AccountInfoRequest}.
   */
  account_root?: string

  /** The object ID of a Check object to retrieve. */
  check?: string

  /**
   * Specify a DepositPreauth object to retrieve. If a string, must be the
   * object ID of the DepositPreauth object, as hexadecimal. If an object,
   * requires owner and authorized sub-fields.
   */
  deposit_preauth?:
    | {
        /** The account that provided the preauthorization. */
        owner: string
        /** The account that received the preauthorization. */
        authorized: string
      }
    | string

  /**
   * The DirectoryNode to retrieve. If a string, must be the object ID of the
   * directory, as hexadecimal. If an object, requires either `dir_root` o
   * Owner as a sub-field, plus optionally a `sub_index` sub-field.
   */
  directory?:
    | {
        /** If provided, jumps to a later "page" of the DirectoryNode. */
        sub_index?: number
        /** Unique index identifying the directory to retrieve, as a hex string. */
        dir_root?: string
        /** Unique address of the account associated with this directory. */
        owner?: string
      }
    | string

  /**
   * The object ID of a transaction emitted by the ledger entry.
   */
  emitted_txn?: string

  /**
   * The Escrow object to retrieve. If a string, must be the object ID of the
   * escrow, as hexadecimal. If an object, requires owner and seq sub-fields.
   */
  escrow?:
    | {
        /** The owner (sender) of the Escrow object. */
        owner: string
        /** Sequence Number of the transaction that created the Escrow object. */
        seq: number
      }
    | string

  /**
   * The hash of the Hook object to retrieve.
   */
  hook_definition?: string

  /**
   * The Hook object to retrieve. If a string, must be the object ID of the Hook.
   * If an object, requires `account` sub-field.
   */
  hook?:
    | {
        /** The account of the Hook object. */
        account: string
      }
    | string

  /**
   * Object specifying the HookState object to retrieve. Requires the sub-fields
   * `account`, `key`, and `namespace_id` to uniquely specify the HookState entry
   * to retrieve.
   */
  hook_state?: {
    /** The account of the Hook object. */
    account: string
    /** The key of the state. */
    key: string
    /** The namespace of the state. */
    namespace_id: string
  }

  /**
   * The Import VL Sequence object to retrieve. If a string, must be the object ID of the VLSequence.
   * If an object, requires `public_key` sub-field.
   */
  import_vlseq?:
    | {
        /** The public_key of the Import VL Sequence object. */
        public_key: string
      }
    | string

  /**
   * The Offer object to retrieve. If a string, interpret as the unique object
   * ID to the Offer. If an object, requires the sub-fields `account` and `seq`
   * to uniquely identify the offer.
   */
  offer?:
    | {
        /** The account that placed the offer. */
        account: string
        /** Sequence Number of the transaction that created the Offer object. */
        seq: number
      }
    | string

  /** The object ID of a PayChannel object to retrieve. */
  payment_channel?: string

  /**
   * Object specifying the RippleState (trust line) object to retrieve. The
   * accounts and currency sub-fields are required to uniquely specify the
   * rippleState entry to retrieve.
   */
  ripple_state?: {
    /**
     * 2-length array of account Addresses, defining the two accounts linked by
     * this RippleState object.
     */
    accounts: string[]
    /** Currency Code of the RippleState object to retrieve. */
    currency: string
  }

  /**
   * The Ticket object to retrieve. If a string, must be the object ID of the
   * Ticket, as hexadecimal. If an object, the `owner` and `ticket_sequence`
   * sub-fields are required to uniquely specify the Ticket entry.
   */
  ticket?:
    | {
        /** The owner of the Ticket object. */
        owner: string
        /** The Ticket Sequence number of the Ticket entry to retrieve. */
        ticket_sequence: number
      }
    | string

  /**
   * The URIToken object to retrieve. If a string, must be the object ID of the
   * URIToken, as hexadecimal. If an object, the `issuer` and `uri`
   * sub-fields are required to uniquely specify the URIToken entry.
   */
  uri_token?:
    | {
        /** The issuer of the URIToken object. */
        issuer: string
        /** The URIToken uri string (ascii). */
        uri: string
      }
    | string
}

/**
 * Response expected from a {@link LedgerEntryRequest}.
 *
 * @category Responses
 */
export interface LedgerEntryResponse extends BaseResponse {
  result: {
    /** The unique ID of this ledger object. */
    index: string
    /** The ledger index of the ledger that was used when retrieving this data. */
    ledger_current_index: number
    /**
     * Object containing the data of this ledger object, according to the
     * ledger format.
     */
    node?: LedgerEntry
    /** The binary representation of the ledger object, as hexadecimal. */
    node_binary?: string
    validated?: boolean
  }
}
