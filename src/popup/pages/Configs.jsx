import React from 'react';
import chromeStorage from 'chrome-storage-wrapper';
export default class Configs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maxConcurrentDownload: 5
        }

        this._changeMaxDownLoad = this._changeMaxDownLoad.bind(this);
        this._saveMaxDownLoad = this._saveMaxDownLoad.bind(this);
    }

    componentDidMount() {
        var self = this;
        chromeStorage.get(['maxConcurrentDownload']).then((items)=> {
            self.setState({
                maxConcurrentDownload: items.maxConcurrentDownload || 5
            })
        })
    }

    _changeMaxDownLoad(e) {
        this.setState({
            maxConcurrentDownload: e.target.value || 5
        })
    }

    _saveMaxDownLoad() {
        var value = this.state.maxConcurrentDownload;

        chromeStorage.set('maxConcurrentDownload', value);
    }

    render() {
        const tab2_label_maxDownload = chrome.i18n.getMessage('popup_configs_label_maxDownload');

        return (
            <div className="pure-u-5-5">
                <div className="pure-form">
                    <fieldset>
                        <label htmlFor="maxConcurrentDownload">{tab2_label_maxDownload} &nbsp;
                            <input id="maxConcurrentDownload" type="number" value={this.state.maxConcurrentDownload}
                                   ref="maxConcurrentDownload" onChange={this._changeMaxDownLoad} step="1" max="25" min="1"/>
                        </label>
                        &nbsp;
                        <button className="pure-button pure-button-primary"
                                onClick={this._saveMaxDownLoad}>
                                <span className="fontawesome-save"></span>
                        </button>
                    </fieldset>
                </div>
            </div>
        )
    }
}