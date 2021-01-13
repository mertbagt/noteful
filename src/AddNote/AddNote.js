import React from 'react'
import PropTypes from 'prop-types'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from "../ValidationError/ValidationError";
import './AddNote.css'

export default class AddNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          name: {
            value: '',
            touched: false
          },
          folder: {
            value: ''
          },
          content: {
            value: '',
          }
        }
      }

    static contextType = ApiContext;

    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    }

    updateFolder(folder) {
        this.setState({folder: {value: folder}});
    }

    updateContent(content) {
        this.setState({content: {value: content}});
    }

    validateName() {
        const name = this.state.name.value.trim();

        let isDuplicate = false;

        for (let i = 0; i < this.context.notes.length; i++) {
            if (this.context.notes[i].name === name) {
                isDuplicate = true;
            }
        }

        if (name.length === 0) {
            return "A note name is required";
          } else if (name.length < 3) {
            return "Note name must be at least 3 characters long";
          } else if (isDuplicate === true) {
            return "Note name must be unique"
          }
    }

    validateFolder() {
        const folder = this.state.folder.value;
        
        if (folder === '') {
            return "Pick a folder";
        }

    }

    handleSubmit(event) {
        event.preventDefault();
//        const id = this.state.name.value;
        const name = this.state.name.value;
//        const modified = Date.now();
//        const folderId = this.state.folder.value;
//        const folder_id =  folderId.toString();
        const folder_id = this.state.folder.value;
        const content = this.state.content.value;
    
//        const newNote = {id, name, modified, folderId, content}
//        const newNote = { name, folderId, content}
        const newNote = { name, folder_id, content}
        fetch(`${config.API_ENDPOINT}/notes`, {
            method: 'POST',
            body: JSON.stringify(newNote),
            headers: {
              'content-type': 'application/json'
            },
          })
            .then(console.log (JSON.stringify(newNote)))
            .then(res => {
              if(!res.ok) {
                throw new Error('Something went wrong, please try again later');
              }
              return res.json();
            })
            .then(data => {
              this.setState({
                name: {
                  value: '',
                  touched: false
                },
                folder: {
                  value: ''
                },
                content: {
                  value: '',
                }
              })
              this.context.addNote(data)
              this.props.history.push('/')
            })
            .catch(error => {
              this.setState({
                error: error.message
              });
            })
    }

    render() {
        const nameError = this.validateName();
        const folderError = this.validateFolder();
        const error = this.state.error
          ? <div className="error">{this.state.error}</div>
          : "";
      
        return (
          <section className='AddNote'>
            <form className="AddNoteForm" onSubmit={e => this.handleSubmit(e)}>
              <div className="AddNote_form_group">
                <h2>Add New Note</h2>
                { error }
                <label htmlFor="name"><pre>Note Name: </pre></label>
                <input
                  type="text"
                  className="AddNote_input"
                  name="name"
                  id="name"
                  onChange={e => this.updateName(e.target.value)}
                  required
                />
              </div>
              <div className="AddNote_form_group">
                <label htmlFor="folder"><pre>Folder: </pre></label>
                <select
                  className="AddNote_folder"
                  name="folder"
                  id="folder"
                  onChange={e => this.updateFolder(e.target.value)}
                >
                  <option defaultValue='default'> -- select an option -- </option>    
                  {this.context.folders.map(folder =>
                    
                    <option value={folder.id} key={folder.id}>
                      {folder.name}
                    </option>
                  )}
                </select>  
              </div>
              <div className="AddNote_form_group">   
                <label htmlFor="content"><pre>Content: </pre></label>
                <textarea
                  className="AddNote_content"
                  name="content"
                  id="content"
                  rows="10"
                  columns="250"
                  onChange={e => this.updateContent(e.target.value)}
                  required
                />
              </div>
              <div className="AddNote_button_group">
                <button type="reset" className="addFolder_button">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="AddNote_button"
                  disabled={
                    this.validateName() ||
                    this.validateFolder()
                  }
                >
                  Save
                </button>
              </div>
              <div className="AddNote_error_group">
                {this.state.name.touched && <ValidationError message={nameError} />}
              </div>
              <div className="AddNote_error_group">
                {this.state.name.touched && <ValidationError message={folderError} />}
              </div>
            </form>
          </section>  
        )
    }
}

AddNote.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object
}