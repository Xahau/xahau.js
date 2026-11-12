import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod'

/**
 * The export_setup command returns the SignerListSet that sets an account up
 * on a network it exports to (Export amendment). It is signed and submitted
 * on that network, then imported here as an XPOP. Expects a response in the
 * form of an {@link ExportSetupResponse}.
 *
 * @category Requests
 */
export interface ExportSetupRequest extends BaseRequest, LookupByLedgerRequest {
  command: 'export_setup'
  /** The account, filled into `tx_json`. */
  account?: string
  /**
   * The network the list is for. Defaults to the one network an import VL key
   * is trusted for here, if there is exactly one, otherwise 0 (the XRPL).
   * Above 1024 it is set as the transaction's `NetworkID`.
   */
  network_id?: number
  /** The `SignerQuorum`. Defaults to 80% of the signers, rounded up. */
  quorum?: number
  /**
   * Ripple epoch seconds: each validator's newest export key recorded at or
   * before then. Defaults to the current keys.
   */
  as_of?: number
}

/**
 * The SignerListSet returned by {@link ExportSetupRequest}. It is complete but
 * for `Sequence` and `Fee` (which autofill supplies from the other network)
 * and, when the request names no account, `Account`.
 *
 * @category Responses
 */
export interface ExportSetupTxJson {
  TransactionType: 'SignerListSet'
  Account?: string
  SignerQuorum: number
  /**
   * The ID of this network, so that the transaction's XPOP can be imported
   * here.
   */
  OperationLimit: number
  /** Present only for networks above 1024. */
  NetworkID?: number
  SignerEntries: Array<{
    SignerEntry: { Account: string; SignerWeight: number }
  }>
}

/**
 * An export key listed by {@link ExportSetupResponse}, and its validator.
 *
 * @category Responses
 */
export interface ExportSetupSigner {
  /** The validator's master public key. */
  validator: string
  /** The validator's export key, hex. */
  export_key: string
  /** When the key was recorded, in ripple epoch seconds. */
  close_time: number
  /** The account of the export key, as listed in the signer list. */
  account: string
}

/**
 * Expected response from an {@link ExportSetupRequest}.
 *
 * @category Responses
 */
export interface ExportSetupResponse extends BaseResponse {
  result: {
    /** `UNLReport.ExportKeysSeq`; the list needs updating when this changes. */
    export_keys_seq: number
    /** The SignerListSet to autofill, sign and submit on the other network. */
    tx_json: ExportSetupTxJson
    /** The export keys the list names, and their validators. */
    signers: ExportSetupSigner[]
    /** The network `tx_json` is for. */
    network_id: number
    /** The steps from here, in words. */
    instructions: string[]
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
}
