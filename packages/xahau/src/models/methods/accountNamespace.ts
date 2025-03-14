import { HookState } from '../ledger'

import { BaseRequest, BaseResponse } from './baseMethod'

/**
 * The `account_namespace` command retrieves the account namespace. All information retrieved is relative to a
 * particular version of the ledger. Returns an {@link AccountNamespaceResponse}.
 *
 * @category Requests
 */
export interface AccountNamespaceRequest extends BaseRequest {
  command: 'account_namespace'
  /** A unique identifier for the account, most commonly the account's address. */
  account: string
  /** The hex namespace. */
  namespace_id?: string
  /** The limit that was used in this request, if any. */
  limit?: number
}

/**
 * Response expected from an {@link AccountNamespaceRequest}.
 *
 * @category Responses
 */
export interface AccountNamespaceResponse extends BaseResponse {
  result: {
    /**
     * The account requested.
     */
    account: string
    /**
     * The namespace_id requested.
     */
    namespace_id: string
    /**
     * A list of HookStates for the specified account namespace_id.
     */
    namespace_entries: HookState[]
    /**
     * The ledger index of the current open ledger, which was used when
     * retrieving this information.
     */
    ledger_current_index: number
    /** If true, this data comes from a validated ledger. */
    validated: boolean
  }
}
