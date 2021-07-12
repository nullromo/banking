import React from 'react';
import { TaggedTransaction, transactionsAreEqual } from './types';
import './styles.css';

interface TransactionHistoryProps {
    deleteTransaction: (transaction: TaggedTransaction) => void;
    transactionHistory: TaggedTransaction[];
}

interface TransactionHistoryState {}

export class TransactionHistory extends React.Component<
    TransactionHistoryProps,
    TransactionHistoryState
> {
    public constructor(props: TransactionHistoryProps) {
        super(props);
        this.state = {};
    }

    public readonly render = () => {
        return (
            <table>
                <thead>
                    <tr>
                        <th colSpan={6}>All Transactions</th>
                    </tr>
                    <tr>
                        <th>Delete</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.transactionHistory.map((transaction, i) => {
                        const tint = this.props.transactionHistory.some(
                            (otherTransaction) => {
                                return (
                                    transactionsAreEqual(
                                        transaction,
                                        otherTransaction,
                                    ) &&
                                    (otherTransaction.category !==
                                        transaction.category ||
                                        otherTransaction.notes !==
                                            transaction.notes)
                                );
                            },
                        )
                            ? 'tinted'
                            : '';
                        return (
                            <tr key={i} className={tint}>
                                <td>
                                    <button
                                        type='button'
                                        onClick={() => {
                                            this.props.deleteTransaction(
                                                transaction,
                                            );
                                        }}
                                    >
                                        X
                                    </button>
                                </td>
                                <td>{transaction.date}</td>
                                <td>{transaction.description}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.notes}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };
}
