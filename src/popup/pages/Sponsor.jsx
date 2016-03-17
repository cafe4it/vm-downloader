import React from 'react';
import ADS from '../../shared/ads.js';
var Sponsor = React.createClass({
    _clickAds(e){
        var ads = this.refs._ads;
        chrome.runtime.sendMessage({
            action : 'OPEN_TAB',
            data : ads.id
        })
    },
    render(){
        let _ads = ADS();
        return <div className="pure-u-5-5">
            <a href="#" key={_ads.id} ref='_ads' id={_ads.id} onClick={this._clickAds}>
                <img className="pure-img" src={_ads.src} width={_ads.width} height={_ads.height} alt=""/>
            </a>
        </div>
    }
})

module.exports = Sponsor;

