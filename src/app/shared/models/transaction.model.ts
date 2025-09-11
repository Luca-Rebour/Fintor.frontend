export interface TransactionModel {
    id: string;
    amount: number;
    description: string;
    date: string;
    movementType: number; // 0 for income, 1 for expense
    recurringTransaction: any;
    category: {
        id: string;
        userId: string;
        name: string;
        icon: string;
    };
}