import React, { Component } from 'react';
import Routes from '../routes';
import '../assets/styles/main.scss';
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
