/*
import chromeStorage from 'chrome-storage-wrapper';
import _ from 'lodash';

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
    if(msg.action === 'FETCH_CLIP'){

    }
});
*/
console.log(document.body)
import _ from 'lodash';
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
	if(msg.action === 'FETCH_IFRAME'){
		console.log(document.body)
	}
});