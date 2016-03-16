import React from 'react';
import chromeStorage from 'chrome-storage-wrapper';
export default class Configs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maxConcurrentDownload : 5
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

    _changeMaxDownLoad(e){
        this.setState({
            maxConcurrentDownload : e.target.value
        })
    }

    _saveMaxDownLoad(){
        this.setState({
            maxConcurrentDownload : this.refs.maxConcurrentDownload.value
        });
        chromeStorage.set('maxConcurrentDownload', this.ref.maxConcurrentDownload.value);
    }

    render() {
        const tab2_label_maxDownload = chrome.i18n.getMessage('popup_tab_2_label_maxDownload');
        const tab2_button_SaveConfig = chrome.i18n.getMessage('popup_tab_2_button_SaveConfig');
        return (
            <div className="pure-u-5-5">
                <div className="pure-form pure-form-stacked">
                    <fieldset>
                        <div className="pure-g">
                            <div className="pure-control-group">
                                <label htmlFor="maxConcurrentDownload">{tab2_label_maxDownload}</label>
                                <input id="maxConcurrentDownload" type="number" value={this.state.maxConcurrentDownload}
                                       ref="maxConcurrentDownload" onChange={this._changeMaxDownLoad}/>
                            </div>
                            <button type="button" className="pure-button pure-button-primary" onClick={this._saveMaxDownLoad}>{tab2_button_SaveConfig}</button>
                        </div>
                    </fieldset>
                </div>
            </div>
        )
    }
}