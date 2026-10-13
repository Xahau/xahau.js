import { BaseRequest, BaseResponse } from './baseMethod'

/**
 * The pwa_validate command checks whether a document hash matches the AppLoader
 * published by an account, optionally for a given domain. Expects a response in
 * the form of a {@link PwaValidateResponse}.
 *
 * The admin-only `pwa_info` method (operator-side counters for the pwa ports)
 * is intentionally not modelled in this library.
 *
 * @category Requests
 */
export interface PwaValidateRequest extends BaseRequest {
  command: 'pwa_validate'
  /** The account whose AppLoader is checked. */
  account: string
  /** Hex SHA-512Half of the document bytes. */
  hash: string
  /** The domain that must be endorsed by the account. */
  domain?: string
}

/**
 * Expected response from a {@link PwaValidateRequest}.
 *
 * @category Responses
 */
export interface PwaValidateResponse extends BaseResponse {
  result: {
    /** The ledger index of the ledger version used to generate this response. */
    ledger_index: number
    /** The AppLoaderSequence of the account's AppLoader, if one exists. */
    app_loader_sequence?: number
    /** Whether the hash (and domain, if given) match the account's AppLoader. */
    valid: boolean
    /** Why the validation failed. */
    reason?: 'no loader' | 'hash mismatch' | 'domain not endorsed by account'
  }
}
