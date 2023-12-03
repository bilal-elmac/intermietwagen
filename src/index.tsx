import './utils/Polyfill.ts';

import React from 'react';
import ReactDOM from 'react-dom';

import { createStore }from './reducers/index';
import resolveInjections from './Injections';

import { App } from './App';
import { AppWrapper } from './AppWrapper';

import './style.css';

const {
    isDebugging,
    backend,
    autocomplete,
    browserHistoryService,

    ...services
} = resolveInjections();

const store = createStore({ isDebugging, backend, autocomplete, browserHistoryService, ...services });

ReactDOM.render(
    <AppWrapper {...services} store={store}>
        <App />
    </AppWrapper>,
    document.getElementById('app'),
);
