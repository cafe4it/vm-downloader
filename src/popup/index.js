import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import Home from './pages/Home.jsx';
import Configs from './pages/Configs.jsx';
import { Router, Route, Link, browserHistory,IndexRoute } from 'react-router'
import 'style!css!purecss/build/pure-min.css';
import './index.css';

import paths from './route_paths.js';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path={paths.index} component={App}>
            <Route path={paths.index} component={Home}/>
            <Route path={paths.configs} component={Configs}/>
        </Route>
    </Router>
    , document.getElementById('app'));