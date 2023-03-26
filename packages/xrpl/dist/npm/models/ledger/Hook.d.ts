import { Hook as WHook } from '../common';
import BaseLedgerEntry from './BaseLedgerEntry';
export default interface Hook extends BaseLedgerEntry {
    LedgerEntryType: 'Hook';
    Account: string;
    OwnerNode: string;
    PreviousTxnID: string;
    PreviousTxnLgrSeq: number;
    Hooks: WHook[];
}
//# sourceMappingURL=Hook.d.ts.map