import React from 'react';
import _ from 'lodash';
export default class Vimeo extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        var _title = _.truncate(this.props.vimeo.title,{'length' : 55});
            _title = _.unescape(_title);
        return (
            <tr>
                <td>{this.props.index}</td>
                <td>{_title}</td>
                <td>
                    <button className="button-error pure-button button-xsmall" onClick={this.props.onDelete}>X</button>
                </td>
            </tr>
        )
    }
}