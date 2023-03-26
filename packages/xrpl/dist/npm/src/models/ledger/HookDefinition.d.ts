import { HookParameter } from '../common';
import BaseLedgerEntry from './BaseLedgerEntry';
export default interface HookDefintion extends BaseLedgerEntry {
    LedgerEntryType: 'HookDefintion';
    Flags: number;
    HookHash: string;
    HookOn?: string;
    HookNamespace?: string;
    HookApiVersion?: string;
    HookParameters?: HookParameter[];
    CreateCode?: string;
    HookSetTxnID?: string;
    ReferenceCount?: number;
    Fee?: string;
    HookCallbackFee?: number;
}
//# sourceMappingURL=HookDefinition.d.ts.map