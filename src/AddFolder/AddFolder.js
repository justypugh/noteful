import React from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from '../config';
import ValidationError from './ValidationError';
import './AddFolder.css';

export default class AddFolder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {   
          name: '',
          folderValid: false,
          validMessage: ''
        }
      }
    
    static defaultProps = {
        history: {
            push: () => {}
        },
    }
    static contextType = ApiContext;

    updateFolder(name) {
        this.setState({name: name}, () => {this.validateFolder(name)})
    }

    validateFolder(inputValue) {
        let errorMessage = this.state.validMessage;
        let hasError = false;

        inputValue = inputValue.trim();
        if (inputValue.length === 0) {
            errorMessage = 'Folder Name is required';
            hasError = true;
        }
        else if (inputValue.length < 3) {
            errorMessage = 'Folder name must contain at least 3 characters';
            hasError = true;
        }
        else {
            errorMessage = '';
            hasError = false;
        }

        this.setState({
            validMessage: errorMessage,
            folderValid: !hasError
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        const folder = {
            name: e.target['folder-name'].value,
        }
        fetch(`${config.API_ENDPOINT}/folders`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(folder),
        })
        .then(res => {
            if (!res.ok) 
                return res.json().then(e => Promise.reject(e))
            return res.json()
        })
        .then(folder => {
            this.context.addFolder(folder)
            this.props.history.push(`/folder/${folder.id}`)
        })
        .catch(error => {
            console.error({error})
        })
    }

    render() {
        return (
            <section className='AddFolder'>
                <h2>Create Folder</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='folder-name-input'>
                            Name
                        </label>
                        <input type='text' id='folder-name-input' name='folder-name' onChange={ (e) => this.updateFolder(e.target.value) } />
                    </div>
                    <ValidationError 
                        hasError={!this.state.folderValid}
                        message={this.state.validMessage}
                    />
                    <div className='buttons'>
                        <button type='submit' disabled={!this.state.folderValid}>
                            Add Folder
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}