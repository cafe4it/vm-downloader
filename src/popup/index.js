import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import Home from './pages/Home.jsx';
import Configs from './pages/Configs.jsx';
import Sponsor from './pages/Sponsor.jsx';
import { Router, Route, Link, browserHistory,IndexRedirect } from 'react-router'
import 'style!css!purecss/build/pure-min.css';
import 'style!css!purecss/build/forms-min.css';
import './index.css';

import paths from './route_paths.js';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path={paths.index} component={App}>
            <IndexRedirect to={paths.home}/>
            <Route path={paths.home} component={Home}/>
            <Route path={paths.configs} component={Configs}/>
            <Route path={paths.sponsor} component={Sponsor}/>
        </Route>
    </Router>
    , document.getElementById('app'));