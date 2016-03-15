import React from 'react';
import Vimeo from './Vimeo.jsx';

export default({vimeos, onDelete})=>{
    const table_title = chrome.i18n.getMessage('popup_table_header_title');
    const label_buttonRemoveAll = chrome.i18n.getMessage('popup_table_header_label_buttonRemoveAll');
    let index = 0;
    return <table className="pure-table pure-table-bordered">
        <thead>
            <tr>
                <th>#</th>
                <th>{table_title}</th>
                <th>
                    <button className="button-error pure-button button-small">{label_buttonRemoveAll}</button>
                </th>
            </tr>
        </thead>
        <tbody>
        {vimeos.map(vimeo =>{
            ++index;
            return <Vimeo key={vimeo.url} index={index} vimeo={vimeo} onDelete={onDelete.bind(null, vimeo.url)}/>
        })}
        </tbody>
    </table>
}