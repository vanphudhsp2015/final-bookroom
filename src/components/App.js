import React, { Component } from 'react';
import Routes from '../routes';
import '../styles/main.scss';
class App extends Component {
  render() {
    return (
      <>
        {Routes()}
      </>
    );
  }
}

export default App;
