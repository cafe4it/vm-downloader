import async from 'async';
import _ from 'lodash';
import chromeStorage from 'chrome-storage-wrapper';
import saveToDB from '../shared/queue_save.js';

var parallelLimit = 2;

var q = async.queue(sendToFetch, parallelLimit);

function sendToFetch(data, cb) {
    try {

        checkExistsUrl(data.playerUrl, function (isExists) {
            if (isExists === false) {
                var myWorker = new Worker(chrome.runtime.getURL('shared/worker.js'));
                myWorker.onmessage = function (e) {
                    saveToDB(e.data);
                    cb(true);
                }
                myWorker.postMessage(data);
            }
        })
    } catch (ex) {
        console.error('save to db...', ex);
    }
}



function checkExistsUrl(url, cb) {
    chromeStorage.get(['vimeos']).then(items => {
        var _vimeos = (items.vimeos) ? JSON.parse(items.vimeos) : [];
        var exists = _.some(_vimeos, function (v) {
            return v.url == url
        });
        cb(exists);
    })
}

module.exports = push;

function push(data, cb) {
    q.push(data, cb);
}