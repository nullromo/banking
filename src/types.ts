export interface Transaction {
    amount: number;
    date: string;
    description: string;
}

export interface TaggedTransaction extends Transaction {
    category: string;
    notes: string;
}

export interface Statement {
    statementDate: Date;
    transactions: Transaction[];
}

export const transactionsAreEqual = (a: Transaction, b: Transaction) => {
    return (
        a.date === b.date &&
        a.description === b.description &&
        a.amount === b.amount
    );
};

export const taggedTransactionsAreEqual = (
    a: TaggedTransaction,
    b: TaggedTransaction,
) => {
    return (
        transactionsAreEqual(a, b) &&
        a.category === b.category &&
        a.notes === b.notes
    );
};
