import { Hook } from '../common';
import { BaseTransaction } from './common';
export interface SetHook extends BaseTransaction {
    TransactionType: 'SetHook';
    Hooks: Hook[];
}
export declare function validateSetHook(tx: Record<string, unknown>): void;
//# sourceMappingURL=setHook.d.ts.map