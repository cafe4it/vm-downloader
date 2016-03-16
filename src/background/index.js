import _ from 'lodash';
import chromeStorage from 'chrome-storage-wrapper';
import saveToDB from '../shared/queue_save.js';
import sendToFetch from '../shared/queue_fetch.js';

chromeStorage.defaultArea = 'local';

//const videoUrlTpl = _.template('https://player.vimeo.com/video/<%=videoId%>');

chromeStorage.addChangeListener((changes, area) => {
    if (changes.vimeos) {
        var vimeos = JSON.parse(changes.vimeos);
        chrome.browserAction.setBadgeText({
            text: (vimeos.length > 0) ? vimeos.length.toString() : ''
        });
    }
}, {
    keys: ['vimeos', 'configs'],
    areas: 'local'
});

/*
 const _AnalyticsCode = 'UA-74453743-5';
 let service, tracker;

 var importScript = (function (oHead) {
 //window.analytics = analytics;
 function loadError(oError) {
 throw new URIError("The script " + oError.target.src + " is not accessible.");
 }

 return function (sSrc, fOnload) {
 var oScript = document.createElement("script");
 oScript.type = "text\/javascript";
 oScript.onerror = loadError;
 if (fOnload) {
 oScript.onload = fOnload;
 }
 oHead.appendChild(oScript);
 oScript.src = sSrc;
 }

 })(document.head || document.getElementsByTagName("head")[0]);

 importScript(chrome.runtime.getURL('shared/google-analytics-bundle.js'), function () {
 console.info('google analytics platform loaded...');
 service = analytics.getService('instagram_easy_downloader');
 tracker = service.getTracker(_AnalyticsCode);
 tracker.sendAppView('App view');
 });
 */

chromeStorage.get(['vimeos', 'configs'])
    .then(items => {
        if (!items.vimeos) {
            chromeStorage.set('vimeos', JSON.stringify([]));
        }
        if (!items.configs) {
            chromeStorage.set('configs', {maxConcurrentDownload: 10});
        }
    });

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (!msg.action) return;
    switch (msg.action) {
        case 'FETCH_CLIP':
            checkExistsUrl(msg.data.playerUrl, function (isExists) {
                if (isExists === false) {
                    var myWorker = new Worker(chrome.runtime.getURL('shared/worker.js'));
                    myWorker.onmessage = function (e) {
                        chrome.runtime.sendMessage({
                            action: 'SAVE_TO_DB',
                            data: e.data
                        })
                        //console.info(e.data);
                    }
                    myWorker.postMessage(msg.data);
                }
            })
            break;
        case 'DOWNLOAD_CLIP':
            chrome.downloads.download({
                url: msg.data.url,
                filename: msg.data.filename,
                conflictAction: 'prompt'
            });
            break;
        case 'SAVE_TO_DB':
            /*chromeStorage.get(['vimeos', 'configs'])
             .then(items => {
             var _vimeos = (items.vimeos) ? JSON.parse(items.vimeos) : [];
             var _configs = items.configs || {maxConcurrentDownload: 10};
             _vimeos = _.unionBy([msg.data], _vimeos, 'url');
             if (_vimeos.length > _configs.maxConcurrentDownload) {
             _vimeos = _.dropRight(_vimeos, (_vimeos.length - _configs.maxConcurrentDownload));
             }

             chromeStorage.set('vimeos', JSON.stringify(_vimeos));
             });*/
            saveToDB(msg.data);
            break;
    }
    return true;
});

function checkExistsUrl(url, cb) {
    chromeStorage.get(['vimeos']).then(items => {
        var _vimeos = (items.vimeos) ? JSON.parse(items.vimeos) : [];
        var exists = _.some(_vimeos, function (v) {
            return v.url == url
        });
        cb(exists);
    })
}

chrome.webRequest.onCompleted.addListener(function (details) {
    try {
        //console.log(details);
        if (details.frameId >= 0 && details.tabId > 0) {
            var playerURL = details.url.split("?")[0],
                playerURL = _.chain(playerURL).replace('/config', '').value();
            var videoId = playerURL.match(/video\/(.*)\/?/);
            if (videoId && videoId.length > 1) {
                videoId = videoId[1];
                sendToFetch({
                    videoId : videoId,
                    playerUrl : playerURL
                })
            }
            /*_.throttle(function () {
                //console.log(playerURL);
                chrome.runtime.sendMessage({
                    action: 'FETCH_CLIP',
                    data: playerURL
                })
            }, 2000, {'trailing': false})();*/

            /*chrome.runtime.sendMessage({
             action: 'FETCH_CLIP',
             data: playerURL
             })*/
        }
    } catch (ex) {
        console.error(ex)
    }
}, {urls: ["*://player.vimeo.com/video/*"]})

chrome.webRequest.onResponseStarted.addListener(function (details) {
    console.log('onResponseStarted', details);
}, {urls: ["*://player.vimeo.com/video/!*"]})

/*
 var filter = {
 url: [{
 urlMatches : '(player\.vimeo.com\/video)'
 }]
 };

 function onWebNav(details) {
 console.log(details);
 }

 chrome.webNavigation.onBeforeNavigate.addListener(onWebNav);

 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo){
 console.log('Tab updated', tabId, changeInfo);
 })*/
