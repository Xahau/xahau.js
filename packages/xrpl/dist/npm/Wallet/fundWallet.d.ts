import type { Client } from '../client';
import Wallet from '.';
declare function fundWallet(this: Client, wallet?: Wallet | null, options?: {
    faucetHost?: string;
    faucetPath?: string;
    amount?: string;
}): Promise<{
    wallet: Wallet;
    balance: number;
}>;
export default fundWallet;
//# sourceMappingURL=fundWallet.d.ts.map