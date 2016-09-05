import React from 'react';
import _ from 'lodash';
import ext from '../../shared/ext.js';
import copyToClipboard from '../../shared/copyToClipboard.js';
export default class Vimeo extends React.Component {
	constructor(props) {
		super(props)
		this._onDownload = this._onDownload.bind(this);
		this._onCopyUrl = this._onCopyUrl.bind(this);
		this.__getSelectedVideo = this.__getSelectedVideo.bind(this);
		this.videos = _
			.chain(this.props.vimeo.videos)
			.map(function (video) {
				return {
					id: video.id,
					index: _.parseInt(video.quality),
					quality: video.quality,
					url: video.url,
					mime: video.mime
				}
			})
			.orderBy(['index'], ['desc']).value();
	}


	_onCopyUrl(e) {
		e.stopPropagation();
		try{
			const selectedVideo = this.__getSelectedVideo();
			if (selectedVideo) {
				copyToClipboard(selectedVideo.url)
			}
		}catch(ex){
			console.log(ex)
		}

	}

	__getSelectedVideo() {
		var selectedVideoId = this.refs.sltQuality.value;
		var selectedVideo = _.find(this.videos, function (v) {
			return v.id == selectedVideoId
		});
		return selectedVideo;
	}

	_onDownload(e) {
		e.stopPropagation();
		const selectedVideo = this.__getSelectedVideo();
		if (selectedVideo) {
			var _title = _
				.chain(this.props.vimeo.title)
				.deburr()
				.words()
				.join(' ')
				.capitalize()
				.value();
			var title = _title + '-' + selectedVideo.quality || selectedVideo.id + '-' + selectedVideo.quality;
			var _ext = ext(selectedVideo.mime || '');
			_.throttle(function () {
				chrome.runtime.sendMessage({
					action: 'DOWNLOAD_CLIP',
					data: {
						filename: title + _ext,
						url: selectedVideo.url
					}
				})
			}, 2000, {'trailing': false})();
		}


	}

	render() {
		var _title = _.truncate(this.props.vimeo.title, {'length': 50});
		_title = _.unescape(_title);


		return (
			<tr>
				<td>{this.props.index}</td>
				<td>{_title}</td>
				<td>
					<select ref="sltQuality">
						{this.videos.map(video=> {
							return <option key={video.id} value={video.id}>{video.quality}</option>
						})}
					</select>
				</td>
				<td>
					<button className="button-warning pure-button button-small video-ctrl-btn"
					        onClick={this._onCopyUrl}>
						<span className="fontawesome-copy"></span>
					</button>
					&nbsp;
					<button className="button-success pure-button button-small video-ctrl-btn"
					        onClick={this._onDownload}>
						<span className="fontawesome-download-alt"></span>
					</button>
					&nbsp;
					<button className="button-error pure-button button-small video-ctrl-btn"
					        onClick={this.props.onDelete}>
						<span className="fontawesome-remove"></span>
					</button>
				</td>
			</tr>
		)
	}
}