import { DecimalPipe } from "@angular/common";

export interface TransactionInterface {
    id: number;
    amount: number;
    description: string;
    transaction_type:string;
}
