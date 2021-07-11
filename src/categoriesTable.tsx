import React from 'react';

interface CategoriesTableProps {
    addCategory: (newCategory: string) => void;
    categories: string[];
}

interface CategoriesTableState {
    errorMessage: string;
    newCategory: string;
}

export class CategoriesTable extends React.Component<
    CategoriesTableProps,
    CategoriesTableState
> {
    public constructor(props: CategoriesTableProps) {
        super(props);
        this.state = { errorMessage: '', newCategory: '' };
    }

    public readonly render = () => {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Categories</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.categories.map((category) => {
                        return (
                            <tr key={category}>
                                <td>{category}</td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td>
                            <input
                                type='text'
                                value={this.state.newCategory}
                                onChange={(event) => {
                                    this.setState({
                                        errorMessage: this.props.categories.includes(
                                            event.target.value,
                                        )
                                            ? 'Category already exists'
                                            : '',
                                        newCategory: event.target.value,
                                    });
                                }}
                            />
                            <button
                                type='button'
                                onClick={() => {
                                    if (this.state.errorMessage !== '') {
                                        return;
                                    }
                                    this.props.addCategory(
                                        this.state.newCategory,
                                    );
                                    this.setState({ newCategory: '' });
                                }}
                            >
                                Add
                            </button>
                            <br />
                            {this.state.errorMessage || <br />}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    };
}
