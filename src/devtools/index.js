import _ from 'lodash'
import saveToDB from '../shared/queue_save.js'
const player_uri = 'player.vimeo.com/video/'
chrome.devtools.network.onRequestFinished.addListener(function (request) {
	if (request.request.url.indexOf(player_uri) !== -1 && request.response.status === 200) {
		request.getContent(function (content, encoding) {
			try{
				const result = {}
				const m1 = content.match(/\"progressive\"\:\[(.*)\]\}\,\"lang\"/)
				const m2 = content.match(/\<title\>(.*)\<\/title\>/)
				if(m2 && m2[1]){
					result.title = m2[1]
				}
				if(m1 && m1[1]){
					result.videos = _.map(JSON.parse('['+m1[1]+']'), (v) => {
						return {
							id : v.id,
							url : v.url,
							mime: v.mime,
							quality : v.quality
						}
					})
				}
				saveToDB(result)
			}catch (ex){
				chrome.devtools.inspectedWindow.eval(
					'console.error("ERROR: " + unescape("' +
					escape(JSON.stringify(ex)) + '"))');
			}

		})
	}
});