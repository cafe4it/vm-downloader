import async from 'async';
import chromeStorage from 'chrome-storage-wrapper';

var parallelLimit = 1;

var q = async.queue(saveToDB, parallelLimit);

function saveToDB(data, cb) {
    try{
        chromeStorage.get(['vimeos', 'configs'])
            .then(items => {
                var _vimeos = (items.vimeos) ? JSON.parse(items.vimeos) : [];
                var _configs = items.configs || {maxConcurrentDownload: 10};
                _vimeos = _.unionBy([data], _vimeos, 'url');
                if (_vimeos.length > _configs.maxConcurrentDownload) {
                    _vimeos = _.dropRight(_vimeos, (_vimeos.length - _configs.maxConcurrentDownload));
                }

                chromeStorage.set('vimeos', JSON.stringify(_vimeos)).then(()=> {
                    cb(true);
                });
            });
    }catch(ex){
        console.error('save to db...', ex);
    }
}

module.exports = push;

function push(data, cb) {
    q.push(data, cb);
}