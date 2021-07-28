import React from 'react';
import { Statement, TaggedTransaction, Transaction } from './types';

interface UploadedStatementProps {
    addTransaction: (transaction: Transaction) => void;
    cache: Partial<Record<string, string>>;
    categories: string[];
    removeTransaction: (transactionNumber: number) => void;
    statement: Statement;
    submitTransactions: (transactions: TaggedTransaction[]) => void;
}

interface UploadedStatementState {
    customTransaction: Transaction;
    notes: string[];
    selectedCategories: Array<string | undefined>;
}

export class UploadedStatement extends React.Component<
    UploadedStatementProps,
    UploadedStatementState
> {
    public constructor(props: UploadedStatementProps) {
        super(props);
        this.state = {
            customTransaction: {
                amount: 0.0,
                date: '',
                description: '',
            },
            notes: props.statement.transactions.map(() => {
                return '';
            }),
            selectedCategories: props.statement.transactions.map(
                (transaction) => {
                    return (
                        this.props.cache[transaction.description] ?? undefined
                    );
                },
            ),
        };
    }

    public readonly render = () => {
        const categoryOptions = (
            <>
                <option>--</option>
                {this.props.categories.map((category) => {
                    return (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    );
                })}
            </>
        );

        const makeCustomTransactionInput = (attribute: keyof Transaction) => {
            return (
                <td>
                    <input
                        type='text'
                        value={this.state.customTransaction[attribute]}
                        onChange={(event) => {
                            this.setState((previousState) => {
                                return {
                                    customTransaction: {
                                        ...previousState.customTransaction,
                                        [attribute]: event.target.value,
                                    },
                                };
                            });
                        }}
                    />
                </td>
            );
        };

        return (
            <>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={6}>
                                Statement{' '}
                                {this.props.statement.statementDate.toString()}
                            </th>
                        </tr>
                        <tr>
                            <th />
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.statement.transactions.map(
                            (transaction, i) => {
                                return (
                                    <tr key={i}>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    this.props.removeTransaction(
                                                        i,
                                                    );
                                                }}
                                            >
                                                ❌
                                            </button>
                                        </td>
                                        <td>{transaction.date}</td>
                                        <td>{transaction.description}</td>
                                        <td>{transaction.amount}</td>
                                        <td>
                                            <select
                                                value={
                                                    this.state
                                                        .selectedCategories[i]
                                                }
                                                onChange={(event) => {
                                                    this.setState(
                                                        (previousState) => {
                                                            const selectedCategories =
                                                                [
                                                                    ...previousState.selectedCategories,
                                                                ];
                                                            selectedCategories[
                                                                i
                                                            ] =
                                                                event.target.value;
                                                            return {
                                                                selectedCategories,
                                                            };
                                                        },
                                                    );
                                                }}
                                            >
                                                {categoryOptions}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type='text'
                                                value={this.state.notes[i]}
                                                onChange={(event) => {
                                                    this.setState(
                                                        (previousState) => {
                                                            const notes =
                                                                previousState.notes;
                                                            notes[i] =
                                                                event.target.value;
                                                            return {
                                                                notes,
                                                            };
                                                        },
                                                    );
                                                }}
                                            />
                                        </td>
                                    </tr>
                                );
                            },
                        )}
                        <tr>
                            <td>
                                <button
                                    onClick={() => {
                                        const amount = this.state
                                            .customTransaction
                                            .amount as unknown as string;
                                        this.props.addTransaction({
                                            date: this.state.customTransaction
                                                .date,
                                            description:
                                                this.state.customTransaction
                                                    .description,
                                            amount: parseFloat(amount),
                                        });
                                    }}
                                >
                                    ➕
                                </button>
                            </td>
                            {makeCustomTransactionInput('date')}
                            {makeCustomTransactionInput('description')}
                            {makeCustomTransactionInput('amount')}
                        </tr>
                        <tr>
                            <td colSpan={3}>
                                <b>Total</b>
                            </td>
                            <td>
                                {this.props.statement.transactions.reduce(
                                    (total, item) => {
                                        return total + item.amount;
                                    },
                                    0,
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button
                    type='button'
                    onClick={() => {
                        if (
                            this.state.selectedCategories.some((category) => {
                                return !Boolean(category);
                            })
                        ) {
                            console.log('undefined category');
                            return;
                        }
                        const selectedCategories = this.state
                            .selectedCategories as string[];
                        this.props.submitTransactions(
                            this.props.statement.transactions.map(
                                (transaction, i) => {
                                    return {
                                        ...transaction,
                                        category: selectedCategories[i],
                                        notes: this.state.notes[i],
                                    };
                                },
                            ),
                        );
                    }}
                >
                    Submit
                </button>
            </>
        );
    };
}
