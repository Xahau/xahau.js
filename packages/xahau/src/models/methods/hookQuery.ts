import { Amount } from '../common'

import { BaseRequest, BaseResponse, LookupByLedgerRequest } from './baseMethod'

/**
 * The `hook_query` command retrieves information about a hook.
 *  Returns an {@link HookQueryResponse}.
 *
 * @category Requests
 */
export interface HookQueryRequest extends BaseRequest, LookupByLedgerRequest {
  command: 'hook_query'
  /** A unique identifier for the account, most commonly the account's address. */
  hook_account: string
  /** A unique identifier for the account, most commonly the account's address. */
  source_account: string
  /** The name of the function to call. */
  function_name: string
  /** The parameters of the function to call. */
  function_params: Record<
    string,
    {
      type: string
      value: number | string | Amount
    }
  >
}

interface BaseHookQueryResponse extends BaseResponse {
  result: {
    /**
     * The account that the hook is registered on.
     */
    hook_account: string
    /**
     * The account that the hook is registered on.
     */
    source_account: string
    /**
     * The results of the function call.
     */
    query_results: Record<
      string,
      {
        type: string
        value: number | string | Amount
      }
    >
  }
}

/**
 * Response expected from a {@link HookQueryRequest}.
 *
 * @category Responses
 */
export interface HookQueryResponse extends BaseHookQueryResponse {
  result: BaseHookQueryResponse['result']
}
