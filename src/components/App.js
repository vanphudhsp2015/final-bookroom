import React, { Component } from 'react';
import Routes from '../routes';
import '../assets/styles/main.scss';
class App extends Component {
  render() {
    return (
      <React.Fragment>
        {Routes()}
      </React.Fragment>
    );
  }
}

export default App;
