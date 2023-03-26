import { Transaction } from '../transactions';
import BaseLedgerEntry from './BaseLedgerEntry';
export default interface EmittedTxn extends BaseLedgerEntry {
    LedgerEntryType: 'EmittedTxn';
    EmittedTxn: Transaction;
    OwnerNode: string;
}
//# sourceMappingURL=EmittedTxn.d.ts.map