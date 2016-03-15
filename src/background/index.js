import _ from 'lodash';
import chromeStorage from 'chrome-storage-wrapper';

chromeStorage.defaultArea = 'local';

//const videoUrlTpl = _.template('https://player.vimeo.com/video/<%=videoId%>');

chromeStorage.addChangeListener((changes, area) => {
    if (changes.vimeos) {
        var vimeos = JSON.parse(changes.vimeos);
        chrome.browserAction.setBadgeText({
            text: vimeos.length.toString()
        });
    }
}, {
    keys: ['vimeos', 'configs'],
    areas: 'local'
});

/*
 const _AnalyticsCode = 'UA-74453743-1';
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
            var myWorker = new Worker(chrome.runtime.getURL('shared/worker.js'));
            myWorker.onmessage = function (e) {
                chromeStorage.get(['vimeos', 'configs'])
                    .then(items => {
                        var _vimeos = (items.vimeos) ? JSON.parse(items.vimeos) : [];
                        var _configs = items.configs || {maxConcurrentDownload: 10};
                        _vimeos = _.unionBy([e.data], _vimeos, 'url');
                        if (_vimeos.length > _configs.maxConcurrentDownload) {
                            _vimeos = _.dropRight(_vimeos, (_vimeos.length - _configs.maxConcurrentDownload));
                        }

                        chromeStorage.set('vimeos', JSON.stringify(_vimeos));
                    });
            }

            myWorker.postMessage(msg.data);
            break;
    }
    return true;
})