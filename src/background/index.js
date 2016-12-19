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
}, {
	keys: ['vimeos', 'maxConcurrentDownload'],
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

chrome.webRequest.onCompleted.addListener(function (details) {
	try {
		if (details.frameId >= 0 && details.tabId >= 0) {
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
					//console.log(data);
					sendToFetch(data);
				}
			}
		}
	} catch (ex) {
		console.error(ex)
	}
}, {urls: ["*://player.vimeo.com/video/*"]})

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (!msg.action) return;
	switch (msg.action) {
		case 'DOWNLOAD_CLIP':
			chrome.downloads.download({
				url: msg.data.url,
				filename: msg.data.filename,
				conflictAction: 'prompt'
			}, function (downloadId) {
				const ldp = 'http://s.click.aliexpress.com/e/U7q7eei' //ello
				let is_send = false
				let _now = Date.now()
				chromeStorage.get(['_PROMOTION_']).then(items => {
					const _PROMOTION_ = items['_PROMOTION_']
					if (!_PROMOTION_) {
						is_send = true
					}else{
						const _1hour = 1000 * 60 * 60
						const _15minutes = _1hour/4
						is_send = ((_now - _PROMOTION_ - _15minutes) / _1hour) >= 2
					}
					if (is_send && is_send === true) {
						chrome.tabs.create({url: ldp, active: false}, function () {
							chromeStorage.set('_PROMOTION_', _now)
							if (tracker) {
								tracker.sendEvent('App', 'Promotion', ldp);
							}
						})
					}
				})
			});
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