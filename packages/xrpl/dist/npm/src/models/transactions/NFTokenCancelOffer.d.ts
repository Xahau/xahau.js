import { BaseTransaction } from './common';
export interface NFTokenCancelOffer extends BaseTransaction {
    TransactionType: 'NFTokenCancelOffer';
    NFTokenOffers: string[];
}
export declare function validateNFTokenCancelOffer(tx: Record<string, unknown>): void;
//# sourceMappingURL=NFTokenCancelOffer.d.ts.map