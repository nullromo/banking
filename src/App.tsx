import React from 'react';
import { CategoriesTable } from './categoriesTable';
import { ServerCalls } from './serverCalls';
import { StatementUploader } from './statementUploader';
import { TransactionHistory } from './transactionHistory';
import rfdc from 'rfdc';
import {
    Statement,
    TaggedTransaction,
    taggedTransactionsAreEqual,
} from './types';
import { UploadedStatement } from './uploadedStatement';
import { Graph, Point } from './graph';

interface AppProps {}

interface AppState {
    cache: Partial<Record<string, string>>;
    categories: string[];
    transactionHistory: TaggedTransaction[];
    uploadedStatements: Statement[];
}

class App extends React.Component<AppProps, AppState> {
    public constructor(props: AppProps) {
        super(props);
        this.state = {
            categories: [],
            cache: {},
            transactionHistory: [],
            uploadedStatements: [],
        };
    }

    public readonly componentDidMount = async () => {
        const transactionHistory = await ServerCalls.loadTransactionHistory();
        const categories = await ServerCalls.loadCategories();
        const cache = await ServerCalls.loadCache();
        this.setState({ categories, cache, transactionHistory });
    };

    public readonly render = () => {
        return (
            <>
                {this.state.transactionHistory.length === 0 ? null : (
                    <Graph
                        canvasHeight={400}
                        canvasWidth={1200}
                        lines={[
                            this.state.transactionHistory
                                .sort((a, b) => {
                                    return (
                                        Date.parse(a.date) - Date.parse(b.date)
                                    );
                                })
                                .reduce((line, transaction, index) => {
                                    return [
                                        ...line,
                                        {
                                            x: Date.parse(transaction.date),
                                            y:
                                                transaction.amount +
                                                (line[index - 1]?.y || 0),
                                        },
                                    ];
                                }, [] as Point[]),
                        ]}
                    />
                )}
                <CategoriesTable
                    addCategory={(newCategory) => {
                        this.setState((previousState) => {
                            const categories = [
                                ...previousState.categories,
                                newCategory,
                            ];
                            ServerCalls.saveCategories(categories);
                            return { categories };
                        });
                    }}
                    categories={this.state.categories}
                    removeCategory={(category) => {
                        this.setState((previousState) => {
                            const categories = previousState.categories.filter(
                                (oldCategory) => {
                                    return category !== oldCategory;
                                },
                            );
                            ServerCalls.saveCategories(categories);
                            return { categories };
                        });
                    }}
                />
                <br />
                <br />
                <br />
                <StatementUploader
                    onUpload={(uploadedStatements) => {
                        this.setState({ uploadedStatements });
                    }}
                />
                <br />
                <br />
                <br />
                {this.state.uploadedStatements.map((statement, i) => {
                    return (
                        <UploadedStatement
                            key={statement.statementDate.toString()}
                            cache={this.state.cache}
                            categories={this.state.categories}
                            statement={statement}
                            addTransaction={(transaction) => {
                                this.setState((previousState) => {
                                    const uploadedStatements = rfdc()(
                                        previousState.uploadedStatements,
                                    );
                                    uploadedStatements[i].transactions.push(
                                        transaction,
                                    );
                                    return { uploadedStatements };
                                });
                            }}
                            negateAllTransactions={() => {
                                this.setState((previousState) => {
                                    const uploadedStatements = rfdc()(
                                        previousState.uploadedStatements,
                                    );
                                    uploadedStatements[i].transactions =
                                        uploadedStatements[i].transactions.map(
                                            (transaction) => {
                                                return {
                                                    ...transaction,
                                                    amount: -transaction.amount,
                                                };
                                            },
                                        );
                                    return { uploadedStatements };
                                });
                            }}
                            negateTransaction={(transactionNumber) => {
                                this.setState((previousState) => {
                                    const uploadedStatements = rfdc()(
                                        previousState.uploadedStatements,
                                    );
                                    uploadedStatements[i].transactions[
                                        transactionNumber
                                    ].amount =
                                        -uploadedStatements[i].transactions[
                                            transactionNumber
                                        ].amount;
                                    return { uploadedStatements };
                                });
                            }}
                            removeTransaction={(transactionNumber) => {
                                this.setState((previousState) => {
                                    const uploadedStatements = rfdc()(
                                        previousState.uploadedStatements,
                                    );
                                    uploadedStatements[i].transactions.splice(
                                        transactionNumber,
                                        1,
                                    );
                                    return { uploadedStatements };
                                });
                            }}
                            submitTransactions={(transactions) => {
                                this.setState((previousState) => {
                                    const cache = previousState.cache;
                                    transactions.forEach((transaction) => {
                                        cache[transaction.description] =
                                            transaction.category;
                                    });
                                    const transactionHistory = [
                                        ...previousState.transactionHistory,
                                        ...transactions.filter(
                                            (transaction) => {
                                                return !previousState.transactionHistory.some(
                                                    (oldTransaction) => {
                                                        return taggedTransactionsAreEqual(
                                                            oldTransaction,
                                                            transaction,
                                                        );
                                                    },
                                                );
                                            },
                                        ),
                                    ];
                                    transactionHistory.sort((a, b) => {
                                        return a.date.localeCompare(b.date);
                                    });
                                    ServerCalls.saveTransactionHistory(
                                        transactionHistory,
                                    );
                                    ServerCalls.saveCache(cache);
                                    return {
                                        transactionHistory,
                                        uploadedStatements: [],
                                        cache,
                                    };
                                });
                            }}
                        />
                    );
                })}
                <br />
                <br />
                <br />
                <TransactionHistory
                    deleteTransaction={(transaction) => {
                        this.setState((previousState) => {
                            const transactionHistory =
                                previousState.transactionHistory.filter(
                                    (oldTransaction) => {
                                        return !taggedTransactionsAreEqual(
                                            oldTransaction,
                                            transaction,
                                        );
                                    },
                                );
                            ServerCalls.saveTransactionHistory(
                                transactionHistory,
                            );
                            return { transactionHistory };
                        });
                    }}
                    transactionHistory={this.state.transactionHistory}
                />
                <br />
                <br />
                <br />
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Cache</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(this.state.cache).map(
                                ([description, category]) => {
                                    return (
                                        <tr key={description}>
                                            <td>{description}</td>
                                            <td>{category}</td>
                                        </tr>
                                    );
                                },
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };
}

export default App;
