import './index.css';
import _ from 'lodash';
import chromeStorage from 'chrome-storage-wrapper';

const vimeoRegex = /vimeo\.com/;
const iframeRegex = 'iframe[src^="https://player.vimeo.com/video/"]';

const videoUrlTpl = _.template('https://player.vimeo.com/video/<%=videoId%>');
const iconUrl = require('../icons/webpack-32.png');

function runFetch(){
    var players = document.querySelectorAll('div[id^="clip_"],iframe[src^="https://player.vimeo.com/video/"],iframe[src^="http://player.vimeo.com/video/"]');
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
}

//runFetch();

$(window.location).bind("change", function (objEvent, objData) {
    console.log(objData);
});

var target = document.body;

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    //console.warn(mutations);
    runFetch();
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };

// pass in the target node, as well as the observer options
observer.observe(target, config);


(function ($) {
    // Default to the current location.
    var strLocation = window.location.href;
    var strHash = window.location.hash;
    var strPrevLocation = "";
    var strPrevHash = "";
    // This is how often we will be checkint for
    // changes on the location.
    var intIntervalTime = 100;
    // This method removes the pound from the hash.
    var fnCleanHash = function (strHash) {
        return (
            strHash.substring(1, strHash.length)
        );
    }
    // This will be the method that we use to check
    // changes in the window location.
    var fnCheckLocation = function () {
        // Check to see if the location has changed.
        if (strLocation != window.location.href) {
            // Store the new and previous locations.
            strPrevLocation = strLocation;
            strPrevHash = strHash;
            strLocation = window.location.href;
            strHash = window.location.hash;
            // The location has changed. Trigger a
            // change event on the location object,
            // passing in the current and previous
            // location values.
            $(window.location).trigger(
                "change",
                {
                    currentHref: strLocation,
                    currentHash: fnCleanHash(strHash),
                    previousHref: strPrevLocation,
                    previousHash: fnCleanHash(strPrevHash)
                }
            );
        }
    }
    // Set an interval to check the location changes.
    setInterval(fnCheckLocation, intIntervalTime);
})(jQuery);