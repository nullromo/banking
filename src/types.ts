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

export enum EndpointNames {
    LOAD_TRANSACTION_HISTORY = '/load-transaction-history',
    SAVE_TRANSACTION_HISTORY = '/save-transaction-history',
    LOAD_CATEGORIES = '/load-categories',
    SAVE_CATEGORIES = '/save-categories',
    LOAD_CACHE = '/load-cache',
    SAVE_CACHE = '/save-cache',
    PARSE_STATEMENT = '/parse-statement',
}
