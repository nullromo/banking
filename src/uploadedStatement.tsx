import React from 'react';
import { Statement, TaggedTransaction } from './types';

interface UploadedStatementProps {
    cache: Partial<Record<string, string>>;
    categories: string[];
    statement: Statement;
    submitTransactions: (transactions: TaggedTransaction[]) => void;
}

interface UploadedStatementState {
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

        return (
            <>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={5}>
                                Statement{' '}
                                {this.props.statement.statementDate.toString()}
                            </th>
                        </tr>
                        <tr>
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
