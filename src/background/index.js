import _ from 'lodash';
import chromeStorage from 'chrome-storage-wrapper';
import saveToDB from '../shared/queue_save.js';
import sendToFetch from '../shared/queue_fetch.js';

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
    //console.info('google analytics platform loaded...');
    service = analytics.getService('vimeo_super_downloader');
    tracker = service.getTracker(_AnalyticsCode);
    tracker.sendAppView('App view');
});

chromeStorage.defaultArea = 'local';

chromeStorage.addChangeListener((changes, area) => {
    if (changes.vimeos) {
        var vimeos = JSON.parse(changes.vimeos);
        chrome.browserAction.setBadgeText({
            text: (vimeos.length > 0) ? vimeos.length.toString() : ''
        });
    }

    if (changes.requestFetch) {
        chrome.runtime.sendMessage({
            action: 'FETCH_CLIP',
            data: changes.requestFetch
        });
        chromeStorage.set('requestFetch', null);
    }

}, {
    keys: ['vimeos', 'maxConcurrentDownload', 'requestFetch'],
    areas: 'local'
});

chromeStorage.get(['vimeos', 'configs'])
    .then(items => {
        if (!items.vimeos) {
            chromeStorage.set('vimeos', JSON.stringify([]));
        }
        if (!items.maxConcurrentDownload) {
            chromeStorage.set('maxConcurrentDownload', 5);
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
            saveToDB(msg.data);
            break;
        case 'OPEN_TAB':
            if (tracker) {
                tracker.sendEvent('App', 'Click Ads', msg.data || '');
            }
            chrome.tabs.create({url: msg.data});
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
            var TYPE = 0;
            var reg1 = /video\/[0-9]+\/?config\?/;
            var reg2 = /video\/[0-9]+\/?/;
            var m3u8 = /\.m3u8/;

            if (reg2.test(details.url)) TYPE = 2;
            if (reg1.test(details.url)) TYPE = 1;

            if (TYPE >= 1) {
                var playerURL = details.url.split("?")[0],
                    playerURL = _.chain(playerURL).replace('/config', '').value();
                var videoId = playerURL.match(/video\/(.*)\/?/);
                if (videoId && videoId.length > 1) {
                    videoId = videoId[1];

                    var data = {
                        videoId: videoId,
                        playerUrl: playerURL,
                        fetchType: TYPE,
                        originUrl: details.url
                    }
                    sendToFetch(data);
                }
            }
        }
    } catch (ex) {
        console.error(ex)
    }
}, {urls: ["*://player.vimeo.com/video/*"]})
