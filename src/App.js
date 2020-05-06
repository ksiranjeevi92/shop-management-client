import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import asyncComponent from './hoc/asyncComponent';

const AsyncHome = asyncComponent(() => {
    return import ('./containers/Home')
});

class App extends Component {
    render () {
        return (
            <div>
               <AsyncHome/>
            </div>
        );
    }
}

export default App;