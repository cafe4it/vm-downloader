import React from 'react';
import Vimeo from './Vimeo.jsx';

export default({vimeos, onDelete, onDeleteAll})=>{
    const table_title = chrome.i18n.getMessage('popup_table_header_title');
    const label_buttonRemoveAll = chrome.i18n.getMessage('popup_table_header_label_buttonRemoveAll');
    let index = 0;
    let display = vimeos.map(vimeo =>{
        ++index;
        return <Vimeo key={vimeo.url} index={index} vimeo={vimeo} onDelete={onDelete.bind(null, vimeo.url)}/>
    });

    if(!vimeos || vimeos.length <=0){
        display = <tr><td colSpan="3">...</td></tr>
    }
    return <table className="pure-table pure-table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>{table_title}</th>
                <th>
                    <button className="button-error pure-button button-small" onClick={onDeleteAll.bind(null)}>{label_buttonRemoveAll}</button>
                </th>
            </tr>
        </thead>
        <tbody>

        {display}
        </tbody>
    </table>
}