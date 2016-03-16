onmessage = function (e) {
    var videoUrl = 'https://vimeo.com/' + e.data.videoId;
    var request = new XMLHttpRequest();
    var result = {};
    result.url = e.data.playerUrl;
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var m0 = request.responseText.match(/og\:title\" content\=\"(.*)\"\>/);
                var m1 = request.responseText.match(/GET\"\,\"(.*)\"\,/);
                var m2 = request.responseText.match(/config\_url\"\:\"(.*)\"\,\"player/);
                var _m;
                if (m0 && (_m = m1 || m2)) {
                    result.title = m0[1];
                    var playerUrl = _m[1];
                    function fetchNext(playerUrl){
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
                                        postMessage(result);
                                        return;
                                    }
                                }
                            }
                            request.open('GET', playerUrl);
                            request.send();
                        }
                    }
                    fetchNext(playerUrl);
                }
            }
        }
        //cb({})
    }

    request.open('GET', videoUrl);
    request.send();
    /*var playerURL = e.data.playerUrl;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var responseText = request.responseText;
                var rs1 = responseText.match(/\"progressive\"\:(.*)\}\,\"ga_account\"/);
                var rs2 = responseText.match(/<title>(.*)<\/title>/);
                if (rs1 && rs1.length > 1 && rs2 && rs2.length > 1) {
                    var videos = JSON.parse(rs1[1]);
                    postMessage({
                        title: rs2[1],
                        url: playerURL,
                        videos: videos
                    });
                }
            }
        }
    }

    request.open('GET', playerURL);
    request.send();*/
}

function fetchAgain(data) {

}