import { Amount } from '../common';
export interface CreatedNode {
    CreatedNode: {
        LedgerEntryType: string;
        LedgerIndex: string;
        NewFields: {
            [field: string]: unknown;
        };
    };
}
export interface ModifiedNode {
    ModifiedNode: {
        LedgerEntryType: string;
        LedgerIndex: string;
        FinalFields?: {
            [field: string]: unknown;
        };
        PreviousFields?: {
            [field: string]: unknown;
        };
        PreviousTxnID?: string;
        PreviousTxnLgrSeq?: number;
    };
}
export interface DeletedNode {
    DeletedNode: {
        LedgerEntryType: string;
        LedgerIndex: string;
        FinalFields: {
            [field: string]: unknown;
        };
    };
}
export type Node = CreatedNode | ModifiedNode | DeletedNode;
export declare function isCreatedNode(node: Node): node is CreatedNode;
export declare function isModifiedNode(node: Node): node is ModifiedNode;
export declare function isDeletedNode(node: Node): node is DeletedNode;
export interface TransactionMetadata {
    AffectedNodes: Node[];
    DeliveredAmount?: Amount;
    delivered_amount?: Amount | 'unavailable';
    TransactionIndex: number;
    TransactionResult: string;
}
//# sourceMappingURL=metadata.d.ts.map