import React from 'react';
import Vimeo from './Vimeo.jsx';

export default({vimeos, onDelete, onDeleteAll})=>{
    const col2_title = chrome.i18n.getMessage('popup_table_col2_header_title');
    const col3_title = chrome.i18n.getMessage('popup_table_col3_header_title');
    //const label_buttonRemoveAll = chrome.i18n.getMessage('popup_table_header_label_buttonRemoveAll');
    let index = 0;
    let display = vimeos.map(vimeo =>{
        ++index;
        return <Vimeo key={vimeo.url} index={index} vimeo={vimeo} onDelete={onDelete.bind(null, vimeo.url)}/>
    });

    if(!vimeos || vimeos.length <=0){
        display = <tr><td colSpan="4">...</td></tr>
    }
    return <table className="pure-table pure-table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>{col2_title}</th>
                <th>{col3_title}</th>
                <th>
                    <button className="button-error pure-button button-small" onClick={onDeleteAll.bind(null)}>
                        <span className="fontawesome-trash"></span>
                    </button>
                </th>
            </tr>
        </thead>
        <tbody>

        {display}
        </tbody>
    </table>
}