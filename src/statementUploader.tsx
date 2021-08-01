import React from 'react';
import { ServerCalls } from './serverCalls';
import { Statement } from './types';

interface StatementUploaderProps {
    onUpload: (uploadedStatements: Statement[]) => void;
}

interface StatementUploaderState {
    pdf: boolean;
}

export class StatementUploader extends React.Component<
    StatementUploaderProps,
    StatementUploaderState
> {
    public constructor(props: StatementUploaderProps) {
        super(props);
        this.state = { pdf: false };
    }

    private fileInput = React.createRef<HTMLInputElement>();

    private readonly parsePDFStatement = async (file: File) => {
        try {
            return (await ServerCalls.parseStatement(file, this.state.pdf))
                .data;
        } catch (error) {
            console.error(error);
        }
    };

    public readonly render = () => {
        return (
            <div>
                <input ref={this.fileInput} type='file' multiple={true} />
                <label>
                    {'PDF'}
                    <input
                        type='checkbox'
                        checked={this.state.pdf}
                        onChange={(event) => {
                            this.setState({ pdf: event.target.checked });
                        }}
                    />
                </label>
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
