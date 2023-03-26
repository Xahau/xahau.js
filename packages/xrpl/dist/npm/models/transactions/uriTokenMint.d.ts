import { BaseTransaction, GlobalFlags } from './common';
export declare enum URITokenMintFlags {
    tfBurnable = 1
}
export interface URITokenMintFlagsInterface extends GlobalFlags {
    tfBurnable?: boolean;
}
export interface URITokenMint extends BaseTransaction {
    TransactionType: 'URITokenMint';
    Flags?: number | URITokenMintFlagsInterface;
    URI: string;
    Digest?: string;
}
export declare function validateURITokenMint(tx: Record<string, unknown>): void;
//# sourceMappingURL=uriTokenMint.d.ts.map