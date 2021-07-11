export interface Transaction {
    amount: number;
    date: string;
    description: string;
}

export interface TaggedTransaction extends Transaction {
    category: string;
}

export interface Statement {
    statementDate: Date;
    transactions: Transaction[];
}
