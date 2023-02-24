import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import firebase from 'firebase';

import Main from './main';

import './style.css';

const config = {
  apiKey: "AIzaSyDOKOTGvGFetT_nuWwk49VsCkhTbwmhc7Q",
  authDomain: "notabilia-crc.firebaseapp.com",
  databaseURL: "https://notabilia-crc.firebaseio.com",
  projectId: "notabilia-crc",
  storageBucket: "notabilia-crc.appspot.com",
  messagingSenderId: "742679769225"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const rrfConfig = {
  userProfile: 'users',
};

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig)
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
});

const initialState = {};

const store = createStoreWithFirebase(rootReducer, initialState);

const App = () => (
  <Provider store={store}>
    <Main/>
  </Provider>
);

render(<App />, document.getElementById('root'));
