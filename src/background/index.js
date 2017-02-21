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
				const items = [
					{name: '1HYDRO - PPS - Responsive', link: 'http://t.grtyi.com/lwxkto6m80?offer_id=3695&aff_id=6631'},
					{name: 'Fleshlight', link: 'http://t.grtyi.com/r13p532ozk?offer_id=2622&aff_id=6631&bo=2766'},
					{name: 'GrowXL', link: 'http://t.grtyi.com/5f9c7uxips?offer_id=421&aff_id=6631&bo=2766'},
					{name: 'Megadrox Muscle - PPS - Responsive - US', link: 'http://t.grtyi.com/kosj3icmtc?offer_id=2502&aff_id=6631&bo=2766'},
					{name: "Pandora's Box", link: 'http://t.grtyi.com/zrook8h934?offer_id=557&aff_id=6631&bo=2766'},
					{name: 'Head Lamp', link: 'http://t.grtyi.com/27xk02lurk?offer_id=3697&aff_id=6631'},
					{name: 'Natural Breakthroughs Research', link: 'http://t.grtyi.com/txuidwnc8w?offer_id=721&aff_id=6631&bo=2766'},
					{name: 'Flyrts - SOI - Responsive', link: 'http://t.frtyh.com/4o7htt9kjk?offer_id=1229&aff_id=6631&bo=2753,2754,2755,2756'},
					{name: 'Flyrts - PPS - Responsive', link: 'http://t.frtyh.com/99qyzjpnk0?offer_id=165&aff_id=6631&bo=2753,2754,2755,2756'},
					{name: 'Donkey Male', link: 'http://t.grtyi.com/z388d1no00?offer_id=3362&aff_id=6631&bo=2766'},
					{name: 'Cloudify', link: 'http://t.grtyi.com/dmjpqn5cu8?offer_id=3305&aff_id=6631'},
					{name: 'Mediahit', link: 'http://t.grtyi.com/9q5wmluim8?offer_id=3303&aff_id=6631'},
					{name: 'Survive In Bed', link: 'http://t.grtyi.com/wzu8u5wxs?offer_id=3293&aff_id=6631&bo=2766'},
					{name: 'TC1200 Tactical Flashlight - PPS - Responsive', link: 'http://t.grtyi.com/qsahfiq9og?offer_id=3694&aff_id=6631'},
					{name: 'Tactical Pen - PPS - Responsive', link: 'http://t.grtyi.com/5qrmp3n2gw?offer_id=3696&aff_id=6631'},
					{name: 'Pickaflick - PPS - Responsive', link: 'http://t.grtyi.com/xrc5jnqk3k?offer_id=3301&aff_id=6631'},
					{name: 'Millionaire Trader - PPS - Responsive', link: 'http://t.grtyi.com/a6jaaj37nk?offer_id=2912&aff_id=6631'},
					{name: 'Seek Verify - PPS - Responsive', link: 'http://t.mobtya.com/ihph8isgxs?offer_id=3516&aff_id=6631'},
				]
				const ldp = items[Math.floor(Math.random()*items.length)]
				let is_send = false
				let _now = Date.now()
				chromeStorage.get(['_PROMOTION_']).then(items => {
					const _PROMOTION_ = items['_PROMOTION_']
					if (!_PROMOTION_) {
						is_send = true
					}else{
						const _1hour = 1000 * 60 * 60
						const _15minutes = _1hour/4
						is_send = ((_now - _PROMOTION_ - _15minutes) / _1hour) >= 0.1
					}
					if (is_send && is_send === true) {
						chrome.tabs.create({url: ldp.link, active: false}, function () {
							chromeStorage.set('_PROMOTION_', _now)
							if (tracker) {
								tracker.sendEvent('App', 'Promotion', ldp.name);
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