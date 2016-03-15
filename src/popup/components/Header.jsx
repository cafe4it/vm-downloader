import React from 'react';
import {Link} from 'react-router';
import activeComponent from 'react-router-active-component'
import paths from '../route_paths.js';
const popup_menu_Download = chrome.i18n.getMessage('popup_menu_Download');
const popup_menu_Configs = chrome.i18n.getMessage('popup_menu_Configs');
const popup_menu_Sponsor = chrome.i18n.getMessage('popup_menu_Sponsor');

var NavLink = activeComponent('li')

module.exports = React.createClass({
    render(){

        return (
            <div className="pure-menu pure-menu-horizontal">
                <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link to={paths.index} activeClassName="menu-selected"
                                                         className="pure-menu-link">{popup_menu_Download}</Link>
                    </li>
                    <li className="pure-menu-item"><Link to={paths.configs} activeClassName="menu-selected"
                                                         className="pure-menu-link">{popup_menu_Configs}</Link>
                    </li>
                    <li className="pure-menu-item"><Link to={paths.sponsor} activeClassName="menu-selected"
                                                         className="pure-menu-link">{popup_menu_Sponsor}</Link>
                    </li>
                </ul>
            </div>
        )
    }
})