import React from 'react';
import chromeStorage from 'chrome-storage-wrapper';
export default class Configs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            configs: {
                maxConcurrentDownload : 5
            }
        }

        this.__changedConfigs = this.__changedConfigs.bind(this);
        this._changeMaxDownLoad = this._changeMaxDownLoad.bind(this);
    }

    componentDidMount() {
        var self = this;
        chromeStorage.get(['configs']).then((items)=> {
            self.setState({
                vimeos: items.configs
            })
        })
    }

    componentDidUpdate() {
        this.__changedConfigs();
    }

    __changedConfigs() {
        var configs = this.state.configs;
        chromeStorage.set('configs', configs);
    }
    _changeMaxDownLoad(){

    }

    render() {
        const tab2_label_maxDownload = chrome.i18n.getMessage('popup_tab_2_label_maxDownload');
        const tab2_button_SaveConfig = chrome.i18n.getMessage('popup_tab_2_button_SaveConfig');
        return <div className="pure-u-5-5">
            <div className="pure-g">
                <div className="pure-control-group">
                    <label htmlFor="name">{tab2_label_maxDownload}</label>
                    <input type="number" value={this.state.configs.maxConcurrentDownload}
                           onChange={this._changeMaxDownLoad}/>
                </div>
                <button type="submit" className="pure-button pure-button-primary">{tab2_button_SaveConfig}</button>
            </div>
        </div>
    }
}