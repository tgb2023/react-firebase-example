import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { map } from 'lodash';

import './main.css';

class Main extends React.Component {
  constructor() {
    super();

    this.state = { key: '', title: '', text: '' };
  }

  clearForm = () => {
    this.setState({ key: '', title: '', text: '' });
  };

  onDeleteClick = key => event => {
    event.stopPropagation();

    const { firebase } = this.props;

    firebase.remove(`notes/${key}`);
  };

  onInputChange = ({ target: { name, value } }) => {
    const { firebase } = this.props;

    if (this.state.key) {
      firebase.update(`notes/${this.state.key}`, { [name]: value });
    } else {
      this.setState({ [name]: value }, () => {
        firebase.push('notes', { title: this.state.title, text: this.state.text }, data => {
          console.log(data);
        });
      });
    }
  };

  onNoteClick = ({ title, text }, key) => {
    this.setState({ key, title, text });
  };

  render() {
    const { notes, firebase } = this.props;

    const notesList = !isLoaded(notes)
      ? <tr><td colspan="3">Loading...</td></tr>
      : isEmpty(notes)
        ? <tr><td colspan="3">Add some notes!</td></tr>
        : map(notes, (note, key) => {
            return (
              <tr key={key} onClick={() => this.onNoteClick(note, key)}>
                <td>{note.title}</td>
                <td>{note.text}</td>
                <td onClick={this.onDeleteClick(key)}>X</td>
              </tr>
            );
          });

      return (
        <div className="main-container">
          <h1>Notes</h1>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Text</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{notesList}</tbody>
          </table>

          <form>
            <div className="form-group">
              <label>Title</label>
              <input 
                className="form-control"
                name="title" 
                value={this.state.title}
                onChange={this.onInputChange}
              />
            </div>
            <div className="form-group">
              <label>Text</label>
              <textarea 
                className="form-control" 
                name="text" 
                value={this.state.text} 
                onChange={this.onInputChange}
              />
            </div>
          </form>
          <div style={{ marginTop: 10 }}>
            <button className="btn btn-danger" onClick={this.clearForm}>Clear</button>
          </div>
        </div>
      );
  }
}


export default compose(
  firebaseConnect([
    'notes'
  ]),
  connect(
    state => ({
      notes: state.firebase.data.notes
    })
  )
)(Main);