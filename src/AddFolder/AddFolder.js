import React from 'react'
import ApiContext from '../ApiContext'
import config from '../config'
import ValidationError from "../ValidationError/ValidationError";
import './AddFolder.css'

export default class AddFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: '',
        touched: false
      }
    }
  }

  static contextType = ApiContext;

  updateName(name) {
    this.setState({name: {value: name, touched: true}});
  }

  validateName() {
    const name = this.state.name.value.trim();
    let isDuplicate = false;

    for (let i = 0; i < this.context.folders.length; i++) {
        if (this.context.folders[i].name === name) {
            isDuplicate = true;
        }
    }

    if (name.length === 0) {
      return "A folder name is required";
    } else if (name.length < 3) {
      return "Folder name must be at least 3 characters long";
    } else if (isDuplicate === true) {
      return "Folder name must be unique"
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const name = this.state.name.value;
    const id = this.state.name.value;
    const newFolder = {id, name}
    fetch(`${config.API_ENDPOINT}/folders`, {
        method: 'POST',
        body: JSON.stringify(newFolder),
        headers: {
          'content-type': 'application/json'
        },
      })
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
            }
          })
          this.context.addFolder(data)
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
    const error = this.state.error
          ? <div className="error">{this.state.error}</div>
          : "";

    return (
      <section className='AddFolder'>
        <form className="AddFolderForm" onSubmit={e => this.handleSubmit(e)}>
          <div className="AddFolder_form_group">
            <h2>Add New Folder</h2>
            { error }
            <label htmlFor="name"><pre>Folder Name: </pre></label>
            <input
              type="text"
              className="AddFolder_input"
              name="name"
              id="name"
              onChange={e => this.updateName(e.target.value)}
              required
            />
          </div>
          <div className="AddFolder_button_group">
            <button type="reset" className="addFolder_button">
              Cancel
            </button>
            <button
              type="submit"
              className="AddFolder_button"
              disabled={this.validateName()}
            >
              Save
            </button>
          </div>
          <div className="AddFolder_error_group">
            {this.state.name.touched && <ValidationError message={nameError} />}  
          </div>
        </form>    
      </section>  
    )
  }
}