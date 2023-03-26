import { Amount } from '../common';
import { BaseTransaction } from './common';
export interface URITokenCreateSellOffer extends BaseTransaction {
    TransactionType: 'URITokenCreateSellOffer';
    URITokenID: string;
    Amount: Amount;
    Destination?: string;
}
export declare function validateURITokenCreateSellOffer(tx: Record<string, unknown>): void;
//# sourceMappingURL=uriTokenCreateSellOffer.d.ts.map