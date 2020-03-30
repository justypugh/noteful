import React from 'react';

export default class HandleError extends React.Component {
    state = {hasError: null};
    static getDerivedStateFromError(error) {
        console.error(error);
        this.setState({hasError: error})
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className='error-page'>
                    <h1>Something has gone wrong!</h1>
                    <p>Please try refreshing the page.</p>
                </main>
            )
        }
        return this.props.children
    }
}