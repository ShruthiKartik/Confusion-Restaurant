import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Main from './components/Main';
import { Provider } from 'react-redux';
import { configureStore } from './redux/configureStore';

const store = configureStore();



export default class App extends Component {
  
  render() {
    return (
      <Provider store={store}>
      <BrowserRouter>
        <div >
          <Main />
        </div>
      </BrowserRouter>
    </Provider>
    )
  }
}
