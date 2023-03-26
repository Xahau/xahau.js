import { BaseTransaction } from './common';
export interface URITokenBurn extends BaseTransaction {
    TransactionType: 'URITokenBurn';
    URITokenID: string;
}
export declare function validateURITokenBurn(tx: Record<string, unknown>): void;
//# sourceMappingURL=uriTokenBurn.d.ts.map