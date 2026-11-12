import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod'

/**
 * The export_info command returns the state of the Export amendment in a
 * ledger. With `account` it returns that account's records, one per network,
 * each with its signers and every export it has in flight. Without it, it
 * returns an overview: the UNL's export keys, the networks known here, the
 * exports in their signing window and a page of the listed exporters. Expects
 * a response in the form of an {@link ExportInfoResponse}.
 *
 * @category Requests
 */
export interface ExportInfoRequest extends BaseRequest, LookupByLedgerRequest {
  command: 'export_info'
  /** Only this account's records. */
  account?: string
  /** The number of exporters per call. Defaults to 50, at most 400. */
  limit?: number
  /** Where the last call's exporters left off, as a hex string. */
  marker?: string
}

/**
 * The few words that identify an exported transaction. Exactly one of
 * `ticket` and `sequence` is present.
 *
 * @category Responses
 */
export type ExportInfoTxn = {
  /** The inner transaction's type, if it is a known one. */
  transaction_type?: string
  /** The inner transaction's `LastLedgerSequence`. */
  last_ledger_sequence?: number
  /** The inner transaction's fee in drops, if it is in XRP. */
  fee?: string
  /** The number of signatures on the inner transaction. */
  signatures: number
} & (
  { ticket: number; sequence?: never } | { sequence: number; ticket?: never }
)

/**
 * The tickets an exporter holds on another network, as ranges.
 *
 * @category Responses
 */
export interface ExportInfoTickets {
  /** The number of unused tickets. */
  count: number
  ranges: Array<{ first: number; count: number }>
  /** The ticket watermark. */
  next?: number
  /** The ticket or Sequence of an automatic TicketCreate that is still out. */
  refill_pending?: number
}

/**
 * An exporter's signer list on another network.
 *
 * @category Responses
 */
export interface ExportInfoSignerList {
  quorum: number
  /** The number of signers. */
  signers: number
  /**
   * Whether it is one of ours: it names an export key of the UNL, so the
   * ledger can sign for it.
   */
  ours: boolean
  /** The ledger on the other network of the SignerListSet that set the list. */
  ledger_index: number
  /** The signers' accounts. Present only with an `account` request. */
  accounts?: string[]
}

/**
 * An export in flight: made, and neither back nor closed as failed. Present
 * only with an `account` request.
 *
 * @category Responses
 */
export interface ExportInfoInFlight {
  /** The index of its ShadowTicket. */
  index: string
  /** The ticket used on the other network. */
  ticket: number
  /** The `Export` transaction that made it, which its Hook's cbak sees as `otxn_id`. */
  export_txn_id?: string
  /** Its id on the other network without signatures. */
  txn_hash: string
  /** Its id as signed, once its signing window has closed at quorum. */
  remote_txn_id?: string
  last_ledger_sequence?: number
  /** The hash of the Hook that made it. */
  hook_hash?: string
  /** Whether it is at quorum and sent; otherwise it is still gathering signatures. */
  signed: boolean
  /** Present only once signed, like the rest of the inner transaction's summary. */
  transaction_type?: string
  sequence?: number
  fee?: string
  signatures?: number
}

/**
 * One Exporter: an account's standing on one network.
 *
 * @category Responses
 */
export interface ExportInfoRecord {
  account: string
  network_id: number
  /** The index of the Exporter object. */
  index: string
  /** Whether the ledger acts for it there (tickets, keys, expiry). */
  listed: boolean
  tickets: ExportInfoTickets
  /** The account's Sequence on the other network. */
  sequence?: number
  /** The account's XRP balance on the other network, in drops. */
  balance?: string
  /** The ledger on the other network that the balance was proven at. */
  balance_ledger_index?: number
  signer_list?: ExportInfoSignerList
  /** The `ExportKeysSeq` the signer list was built for. */
  keys_seq?: number
  /** The number of exports in flight. */
  in_flight: number
  /** The exports in flight. Present only with an `account` request. */
  exports?: ExportInfoInFlight[]
}

/**
 * The UNL's export keys and how they are turning over.
 *
 * @category Responses
 */
export interface ExportInfoKeys {
  export_keys_seq: number
  rotation_period: number
  /** The rotation epoch. */
  epoch: number
  /** When the epoch ends, in ripple epoch seconds. */
  epoch_ends: number
  max_keys: number
  max_keys_per_epoch: number
  refresh_every: number
  /** The number of UNLReport validators. */
  validators: number
  /** The number of them that hold a key. */
  with_key: number
  /** The number of them that had a key recorded this epoch. */
  rotated_this_epoch: number
  /** The number of signers in the list a new exporter would get. */
  signers: number
  /** The quorum of that list. */
  quorum: number
}

/**
 * A UNLReport validator and its export key.
 *
 * @category Responses
 */
export interface ExportInfoValidator {
  /** The validator's master public key. */
  validator: string
  account: string
  /** Whether the account exists; without it, its key reports have nowhere to go. */
  funded: boolean
  /** The number of export keys it holds. */
  keys: number
  /** Its current export key, hex. Absent when it holds none. */
  export_key?: string
  export_account?: string
  /** When the current key was recorded, in ripple epoch seconds. */
  recorded?: number
  /** Whether the current key was recorded this epoch. */
  this_epoch?: boolean
}

/**
 * A network known here, and what has been proven of it.
 *
 * @category Responses
 */
export interface ExportInfoNetwork {
  network_id: number
  /** The number of VL keys trusted for it. */
  vl_keys: number
  /** The latest ledger proven by `Ingest`, which exports expire by. Present only once one has been. */
  ledger_index?: number
  /** The drops per signature that exports default to. */
  fee_unit?: number
  sample_fee?: number
  /** The number of transactions in that ledger. */
  transactions?: number
}

/**
 * An export in its signing window.
 *
 * @category Responses
 */
export type ExportInfoPending = {
  /** The index of its ExportedTxn object. */
  index: string
  owner: string
  network_id: number
  /** The ledger in which it was created. */
  created: number
  /** The ledger in which its signing window closes. */
  closes: number
  export_txn_id?: string
  /** Its id on the other network without signatures. */
  txn_hash: string
  /** The signer weight gathered so far. */
  weight: number
  quorum: number
} & ExportInfoTxn

/**
 * Members of an {@link ExportInfoResponse} that every response has.
 *
 * @category Responses
 */
export interface ExportInfoCommon {
  /** Whether the Export amendment is enabled in this ledger. */
  enabled: boolean
  /** This server's network ID. */
  network_id: number
  /** The one network an import VL key is trusted for here, or 0 (the XRPL). */
  default_network_id: number
  /**
   * The identifying hash of the ledger that was used to generate this
   * response.
   */
  ledger_hash?: string
  /**
   * The ledger index of the ledger version that was used to generate this
   * response.
   */
  ledger_index?: number
  /**
   * The ledger index of the current in-progress ledger version, which was
   * used to generate this response.
   */
  ledger_current_index?: number
  /**
   * If included and set to true, the information in this response comes from
   * a validated ledger version. Otherwise, the information is subject to
   * change.
   */
  validated?: boolean
}

/**
 * The response to an {@link ExportInfoRequest} with `account`.
 *
 * @category Responses
 */
export interface ExportInfoAccountResult {
  records: ExportInfoRecord[]
}

/**
 * The response to an {@link ExportInfoRequest} without `account`.
 *
 * @category Responses
 */
export interface ExportInfoOverviewResult {
  keys: ExportInfoKeys
  validators: ExportInfoValidator[]
  networks: ExportInfoNetwork[]
  /** Exports in their signing window. */
  pending: ExportInfoPending[]
  /** A page of the listed exporters, without their signer accounts or exports. */
  exporters: ExportInfoRecord[]
  /** The number of listed exporters in all. */
  exporters_listed: number
  /** Pass this to the next call to resume where this call left off. Omitted when there are no more. */
  marker?: string
}

/**
 * Expected response from an {@link ExportInfoRequest}.
 *
 * @category Responses
 */
export interface ExportInfoResponse extends BaseResponse {
  result: ExportInfoCommon &
    (ExportInfoAccountResult | ExportInfoOverviewResult)
}
