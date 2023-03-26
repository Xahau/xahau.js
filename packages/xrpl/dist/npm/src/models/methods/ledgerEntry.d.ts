import { LedgerIndex } from '../common';
import { LedgerEntry } from '../ledger';
import { BaseRequest, BaseResponse } from './baseMethod';
export interface LedgerEntryRequest extends BaseRequest {
    command: 'ledger_entry';
    binary?: boolean;
    ledger_hash?: string;
    ledger_index?: LedgerIndex;
    index?: string;
    account_root?: string;
    check?: string;
    deposit_preauth?: {
        owner: string;
        authorized: string;
    } | string;
    directory?: {
        sub_index?: number;
        dir_root?: string;
        owner?: string;
    } | string;
    escrow?: {
        owner: string;
        seq: number;
    } | string;
    offer?: {
        account: string;
        seq: number;
    } | string;
    payment_channel?: string;
    ripple_state?: {
        accounts: string[];
        currency: string;
    };
    ticket?: {
        owner: string;
        ticket_sequence: number;
    } | string;
    emitted_txn?: string;
    hook_definition?: string;
    hook?: {
        account: string;
    } | string;
    hook_state?: {
        account: string;
        key: string;
        namespace_id: string;
    };
}
export interface LedgerEntryResponse extends BaseResponse {
    result: {
        index: string;
        ledger_current_index: number;
        node?: LedgerEntry;
        node_binary?: string;
        validated?: boolean;
    };
}
//# sourceMappingURL=ledgerEntry.d.ts.map