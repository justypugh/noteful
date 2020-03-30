import React from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from '../config';
import ValidationError from '../AddFolder/ValidationError';
import './AddNote.css';

export default class AddNote extends React.Component {
    constructor(props) {
        super(props)
        this.state ={
          noteName: '',
          noteContent: '',
          folder: '',
          folderId: '',
          validNoteMessage: '',
          validNoteName: false,
          validContentMessage: '',
          validContent: false,
          validFolderMessage: '',
          validFolder: false,
          datetime: new Date()
        }
      }
    
    static defaultProps = {
        history: {
            push: () => {}
        },
    }
    static contextType = ApiContext;

    updateNoteName(name){
        this.setState({noteName: name}, () => {this.validateNoteName(name)})
      }

    updateNoteContent(content){
        this.setState({noteContent: content}, () => {this.validateNoteContent(content)})
      }

    updateFolder(name){
        this.setState({folder: name}, () => {this.validateFolder(name)})
      }

    validateFolder(name){
        let errorMsg = this.state.validFolderMessage;
        let hasError = false;
        if(this.context.folders.find((folder) => folder.name === name) === undefined){
          errorMsg = 'Please select a valid folder'
          hasError = true;
        } else {
          errorMsg = '';
          hasError = false;
        }
          this.setState({
            validFolderMessage: errorMsg,
            validFolder: !hasError
        })
      }

    validateNoteName(name){
        let errorMsg = this.state.validNoteMessage;
        let hasError = false;
        name = name.trim();
        if(name.length < 3){
          errorMsg = 'Please enter a note name at least 3 characters long';
          hasError = true;
        } else {
          errorMsg = '';
          hasError = false;
        }
        this.setState({
          validMessage: errorMsg, 
          validNoteName: !hasError
        })
      }

    validateNoteContent(content){
        let errorMsg = this.state.validContentMessage;
        let hasError = false;
        content = content.trim();
        if(content.length < 3){
          errorMsg = 'Please enter content that is at least 3 characters long';
          hasError = true;
        } else {
          errorMsg = '';
          hasError = false;
        }
        this.setState({
          validContentMessage: errorMsg,
          validContent: !hasError
        })
      }

    handleSubmit = e => {
        e.preventDefault();
        const newNote = {
            name: e.target['note-name'].value,
            content: e.target['note-content'].value,
            folderId: e.target['note-folder-id'].value,
            modified: new Date(),
        }

        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newNote),
        })
        .then(res => {
            if (!res.ok)
                return res.json().then(e => Promise.reject(e))
            return res.json()
        })
        .then(note => {
            this.context.addNote(note)
            this.props.history.push(`/folder/${note.folderId}`)
            console.log(note)
        })
        .catch(error => {
            console.error({error})
        })
    }

    render() {
        const { folders=[] } = this.context

        return (
            <section className='AddNote'>
                <h2>Create Note</h2>
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <label htmlFor='note-name-input'>
                            Name
                        </label>
                        <input type='text' id='note-name-input' name='note-name' placeholder='Name'  onChange = {(e) => this.updateNoteName(e.target.value)}/>
                    </div>
                    <div className='field'>
                        <label htmlFor='note-content-input'>
                            Content
                        </label>
                        <textarea id='note-content-input' name='note-content' placeholder='Content'  onChange = {(e) => this.updateNoteContent(e.target.value)}/>
                    </div>
                    <div className='field'>
                        <label htmlFor='note-folder-select'>
                            Folder
                        </label>
                        <select id='note-folder-select' name='note-folder-id'>
                            <option value={null}>...</option>
                            {folders.map(folder =>
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>    
                            )}
                        </select>
                    </div>
                    <ValidationError 
                        hasError={!this.state.validNoteName}
                        message={this.state.validMessage}
                    />
                    <div className='buttons'>
                        <button type='submit' disabled={!this.state.validNoteName || !this.state.validContent} >
                            Add Note
                        </button>
                        {!this.state.validNoteName ? <p>{this.state.validNoteMessage}</p> : <></>}
                        {!this.state.validContent ? <p>{this.state.validContentMessage}</p>: <></>}
                        {!this.state.validFolder ? <p>{this.state.validFolderMessage}</p> : <> </>}
                    </div>
                </NotefulForm>
            </section>
        )
    }
}