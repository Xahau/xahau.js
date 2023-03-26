import { Amount } from '../common';
import { BaseTransaction } from './common';
export interface URITokenBuy extends BaseTransaction {
    TransactionType: 'URITokenBuy';
    URITokenID: string;
    Amount: Amount;
}
export declare function validateURITokenBuy(tx: Record<string, unknown>): void;
//# sourceMappingURL=uriTokenBuy.d.ts.map