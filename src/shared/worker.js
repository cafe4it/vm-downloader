onmessage = function (e) {
    var result = {};
    result.url = e.data.playerUrl;
    var TYPE = e.data.fetchType;

    function fetchNext(playerUrl, result){
        var result = result || {}
        if (playerUrl) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    if (request.getResponseHeader('Content-Type') === 'application/json') {
                        var obj = JSON.parse(request.responseText);
                        //var videos = _.get(obj, 'request.files.progressive', []);
                        if (obj && obj.request && obj.request.files && obj.request.files.progressive) {
                            result.videos = obj.request.files.progressive.map(function(v){
                                return {
                                    id : v.id,
                                    url : v.url,
                                    quality : v.quality
                                }
                            });
                        }
                        if(obj && obj.video && obj.video.title){
                            result.title = obj.video.title;
                        }
                        postMessage(result);
                        return;
                    }
                }
            }
            request.open('GET', playerUrl);
            request.send();
        }
    }

    if(TYPE === 1){
        fetchNext(e.data.originUrl, result);
    } else{
        var videoUrl = 'https://vimeo.com/' + e.data.videoId;

        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var m0 = request.responseText.match(/og\:title\" content\=\"(.*)\"\>/);
                    var m1 = request.responseText.match(/GET\"\,\"(.*)\"\,/);
                    var m2 = request.responseText.match(/config\_url\"\:\"(.*)\"\,\"player/);
                    var m3 = request.responseText.match(/data\-config\-url\=\"(.*)\" data\-fallback\-url/);
                    var _m;
                    if (m0 && (_m = m1 || m2 || m3)) {
                        result.title = m0[1];
                        var playerUrl = _m[1].replace(/&amp;/g, '&');

                        fetchNext(playerUrl,result);
                    }
                }
            }
            //cb({})
        }

        request.open('GET', videoUrl);
        request.send();
    }

}
