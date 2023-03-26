import { Amount } from '../common';
import { BaseTransaction, GlobalFlags } from './common';
export declare enum NFTokenCreateOfferFlags {
    tfSellNFToken = 1
}
export interface NFTokenCreateOfferFlagsInterface extends GlobalFlags {
    tfSellNFToken?: boolean;
}
export interface NFTokenCreateOffer extends BaseTransaction {
    TransactionType: 'NFTokenCreateOffer';
    NFTokenID: string;
    Amount: Amount;
    Owner?: string;
    Expiration?: number;
    Destination?: string;
    Flags?: number | NFTokenCreateOfferFlagsInterface;
}
export declare function validateNFTokenCreateOffer(tx: Record<string, unknown>): void;
//# sourceMappingURL=NFTokenCreateOffer.d.ts.map