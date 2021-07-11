import React from 'react';
import { TaggedTransaction } from './types';

interface TransactionHistoryProps {
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
                        <th colSpan={4}>All Transactions</th>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.transactionHistory.map((transaction, i) => {
                        return (
                            <tr key={i}>
                                <td>{transaction.date}</td>
                                <td>{transaction.description}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.category}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };
}
