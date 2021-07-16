import React from 'react';
import { ServerCalls } from './serverCalls';
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
        try {
            return (await ServerCalls.parseStatement(file)).data;
        } catch (error) {
            console.error(error);
        }
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
