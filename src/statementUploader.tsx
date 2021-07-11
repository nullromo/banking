import React from 'react';
import { Statement, Transaction } from './types';

interface StatementUploaderProps {
    onUpload: (uploadedStatements: Statement[]) => void;
}

interface StatementUploaderState {}

export class StatementUploader extends React.Component<
    StatementUploaderProps,
    StatementUploaderState
> {
    public constructor(props: StatementUploaderProps) {
        super(props);
        this.state = {};
    }

    private fileInput = React.createRef<HTMLInputElement>();

    private readonly parsePDFStatement = async (file: File) => {
        return {
            transactions: [
                {
                    date: '2021-06-05',
                    description: 'safeway',
                    amount: 120.45,
                },
                {
                    date: '2021-06-11',
                    description: 'eshakti',
                    amount: 32.34,
                },
                {
                    date: '2021-06-20',
                    description: "trader joe's",
                    amount: 66.78,
                },
                {
                    date: '2021-06-21',
                    description: 'randomThing',
                    amount: 0.01,
                },
            ] as Transaction[],
            statementDate: new Date(2021, 6),
        };
    };

    public readonly render = () => {
        return (
            <div>
                <input ref={this.fileInput} type='file' multiple={true} />
                <button
                    type='button'
                    onClick={async () => {
                        const files = Array.from(
                            this.fileInput.current?.files ?? [],
                        );
                        this.props.onUpload(
                            await Promise.all(
                                files.map(this.parsePDFStatement),
                            ),
                        );
                        if (this.fileInput.current) {
                            this.fileInput.current.value = '';
                        }
                    }}
                >
                    Parse
                </button>
            </div>
        );
    };
}
