import async from 'async';
import chromeStorage from 'chrome-storage-wrapper';
var parallelLimit = 1;

var q = async.queue(sendToFetch, parallelLimit);

function sendToFetch(data, cb) {
    try{
        chromeStorage.set('requestFetch', data);
        /*chrome.runtime.sendMessage({
            action: 'FETCH_CLIP',
            data: data
        });*/
        cb(true);
    }catch(ex){
        console.error('save to db...', ex);
    }
}

module.exports = push;

function push(data, cb) {
    q.push(data, cb);
}