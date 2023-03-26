import { Amount } from '../common';
import { BaseTransaction } from './common';
export interface NFTokenAcceptOffer extends BaseTransaction {
    TransactionType: 'NFTokenAcceptOffer';
    NFTokenSellOffer?: string;
    NFTokenBuyOffer?: string;
    NFTokenBrokerFee?: Amount;
}
export declare function validateNFTokenAcceptOffer(tx: Record<string, unknown>): void;
//# sourceMappingURL=NFTokenAcceptOffer.d.ts.map