import './index.css';
import _ from 'lodash';
import chromeStorage from 'chrome-storage-wrapper';

const vimeoRegex = /vimeo\.com/;
const iframeRegex = 'iframe[src^="https://player.vimeo.com/video/"]';

const videoUrlTpl = _.template('https://player.vimeo.com/video/<%=videoId%>');
const iconUrl = require('../icons/webpack-32.png');

var players = document.querySelectorAll('div[id^="clip_"],iframe[src^="https://player.vimeo.com/video/"]');
_.each(players, function (player) {
    var videoURL = null;
    if(player.nodeName === 'DIV'){
        var videoId = player.id.replace('clip_','');
        if (videoId) {
            videoURL = videoUrlTpl({videoId: videoId});

        }
    }else if(player.nodeName === 'IFRAME'){
        videoURL = player.src.substring(0, player.src.indexOf('?'));
    }
    if(videoURL){
        chromeStorage.get(['vimeos']).then((items)=>{
            var vimeos = (items.vimeos) ? JSON.parse(items.vimeos) : [];
            var isExits = _.some(vimeos, {url : videoURL});
            if(!isExits || isExits === false){
                chrome.runtime.sendMessage({
                    action: 'FETCH_CLIP',
                    data: videoURL
                })
            }
        })
    }
})

function fetchClip(url) {

}