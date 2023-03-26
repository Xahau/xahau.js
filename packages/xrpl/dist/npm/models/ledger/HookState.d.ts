import BaseLedgerEntry from './BaseLedgerEntry';
export default interface HookState extends BaseLedgerEntry {
    LedgerEntryType: 'HookState';
    OwnerNode: string;
    HookStateKey: string;
    HookStateData: string;
}
//# sourceMappingURL=HookState.d.ts.map