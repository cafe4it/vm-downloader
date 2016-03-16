import React from 'react';
import chromeStorage from 'chrome-storage-wrapper';
import Vimeos from '../components/Vimeos.jsx';
var Loader = require('react-loader');
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vimeos: [],
            loaded : false
        }

        this.__vimeosChanged = this.__vimeosChanged.bind(this);
        this._deleteVimeo = this._deleteVimeo.bind(this);
        this._deleteAll = this._deleteAll.bind(this);

    }

    componentDidMount() {
        var self = this;
        chromeStorage.get(['vimeos']).then((items)=> {
            var vimeos = JSON.parse(items.vimeos);
            self.setState({
                vimeos: vimeos,
                loaded : true
            })
        })
    }

    componentDidUpdate() {
        this.__vimeosChanged();
    }

    __vimeosChanged() {
        var vimeos = this.state.vimeos;
        chromeStorage.set('vimeos', JSON.stringify(vimeos));
    }
    _deleteVimeo(url, e) {
        e.stopPropagation();
        this.setState({
            vimeos: this.state.vimeos.filter(vimeo => vimeo.url !== url)
        });
    }

    _deleteAll(e) {
        e.stopPropagation();
        this.setState({
            vimeos: []
        })
    }


    render() {
        const vimeos = this.state.vimeos;
        return <div className="pure-u-5-5">
            <Loader loaded={this.state.loaded}>
            <Vimeos vimeos={vimeos} onDelete={this._deleteVimeo} onDeleteAll={this._deleteAll}/>
            </Loader>
        </div>
    }
}