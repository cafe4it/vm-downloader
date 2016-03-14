onmessage = function (e) {
    var playerURL = e.data;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var responseText = request.responseText;
            var rs1 = responseText.match(/\"progressive\"\:(.*)\}\,\"ga_account\"/);
            var rs2 = responseText.match(/<title>(.*)<\/title>/);
            if (rs1 && rs1.length > 1 && rs2 && rs2.length > 1) {
                var videos = JSON.parse(rs1[1]);
                postMessage({
                    title : rs2[1],
                    url : playerURL,
                    videos : videos
                });
            }
        }
    }

    request.open('GET', playerURL);
    request.send();
}