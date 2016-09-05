import _ from 'lodash'

export default function(mime){
	const mimes = [
		{type: 'video/x-flv', ext: '.flv'},
		{type: 'video/mp4', ext: '.mp4'},
		{type: 'application/x-mpegURL', ext: '.m3u8'},
		{type: 'video/MP2T', ext: '.ts'},
		{type: 'video/3gpp', ext: '.3gp'},
		{type: 'video/quicktime', ext: '.mov'},
		{type: 'video/x-msvideo', ext: '.avi'},
		{type: 'video/x-ms-wmv', ext: '.wmv'},
	]
	const m = _.find(mimes, (m)=>{ return m.type.toLowerCase() === mime.toLowerCase()});
	return m ? m.ext : '';
}