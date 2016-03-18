import React from 'react';
import ImageLoader from 'react-imageloader';
import ADS from '../../shared/ads.js';

function preloader() {
    return <img src={require("../../icons/loading.gif")} />;
}

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
        let imgProps = {
            width : _ads.width,
            height : _ads.height,
            className : 'pure-img'
        }
        return <div className="pure-u-5-5 ads_container">
            <a href="#" key={_ads.id} ref='_ads' id={_ads.id} onClick={this._clickAds} imgProps={imgProps}>
                <ImageLoader src={_ads.src} preloader={preloader} wrapper={React.DOM.div}>
                    <img className="pure-img" src={_ads.src} width={_ads.width} height={_ads.height} alt=""/>
                </ImageLoader>

            </a>
        </div>
    }
})

module.exports = Sponsor;

