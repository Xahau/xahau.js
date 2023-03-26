import { BaseTransaction } from './common';
export interface URITokenCancelSellOffer extends BaseTransaction {
    TransactionType: 'URITokenCancelSellOffer';
    URITokenID: string;
}
export declare function validateURITokenCancelSellOffer(tx: Record<string, unknown>): void;
//# sourceMappingURL=uriTokenCancelSellOffer.d.ts.map