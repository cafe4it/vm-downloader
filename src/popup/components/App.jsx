import React from 'react';
import chromeStorage from 'chrome-storage-wrapper';

import Vimeos from './Vimeos.jsx';

export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            vimeos : [],
            configs : {}
        }

        this.__vimeosChanged = this.__vimeosChanged.bind(this);
        this.__configsChanged = this.__configsChanged.bind(this);
        this._deleteVimeo = this._deleteVimeo.bind(this);
    }

    componentDidMount() {
        var self = this;
        chromeStorage.get(['vimeos','configs']).then((items)=>{
            var vimeos = JSON.parse(items.vimeos);
            self.setState({
                vimeos : vimeos,
                configs : items.configs || {}
            })
        })
    }

    componentDidUpdate(){
        this.__vimeosChanged();
        this.__configsChanged();
    }

    __vimeosChanged(){
        var vimeos = this.state.vimeos;
        chromeStorage.set('vimeos', JSON.stringify(vimeos));
    }

    __configsChanged(){
        chromeStorage.set('configs', this.state.configs);
    }

    _deleteVimeo(url, e){
        e.stopPropagation();
        this.setState({
            vimeos : this.state.vimeos.filter(vimeo => vimeo.url !== url)
        });
    }

    render(){
        const vimeos = this.state.vimeos;

        return <div>
            <Vimeos vimeos={vimeos} onDelete={this._deleteVimeo}/>
        </div>
    }
}