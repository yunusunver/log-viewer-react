import React, { Component } from 'react';
import LogContainer from './logContainer';

export default class LogList extends Component {
    render () {
        return (
            <div className="content" id="content">
                <LogContainer/>
            </div>
        )
    }
}