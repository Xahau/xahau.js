import { BaseRequest, BaseResponse } from './baseMethod';
export interface FederatorInfoRequest extends BaseRequest {
    command: 'federator_info';
}
export interface FederatorInfoResponse extends BaseResponse {
    result: {
        info: {
            mainchain: {
                door_status: {
                    initialized: boolean;
                    status: 'open' | 'opening' | 'closed' | 'closing';
                };
                last_transaction_sent_seq: number;
                listener_info: {
                    state: 'syncing' | 'normal';
                };
                pending_transactions: Array<{
                    amount: string;
                    destination_account: string;
                    signatures: Array<{
                        public_key: string;
                        seq: number;
                    }>;
                }>;
                sequence: number;
                tickets: {
                    initialized: boolean;
                    tickets: Array<{
                        status: 'taken' | 'available';
                        ticket_seq: number;
                    }>;
                };
            };
            public_key: string;
            sidechain: {
                door_status: {
                    initialized: boolean;
                    status: 'open' | 'opening' | 'closed' | 'closing';
                };
                last_transaction_sent_seq: number;
                listener_info: {
                    state: 'syncing' | 'normal';
                };
                pending_transactions: Array<{
                    amount: string;
                    destination_account: string;
                    signatures: Array<{
                        public_key: string;
                        seq: number;
                    }>;
                }>;
                sequence: number;
                tickets: {
                    initialized: boolean;
                    tickets: Array<{
                        status: 'taken' | 'available';
                        ticket_seq: number;
                    }>;
                };
            };
        };
    };
}
//# sourceMappingURL=federatorInfo.d.ts.map