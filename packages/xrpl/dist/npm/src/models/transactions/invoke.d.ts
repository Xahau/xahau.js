import { BaseTransaction } from './common';
export interface Invoke extends BaseTransaction {
    TransactionType: 'Invoke';
    Destination?: string;
}
export declare function validateInvoke(tx: Record<string, unknown>): void;
//# sourceMappingURL=invoke.d.ts.map