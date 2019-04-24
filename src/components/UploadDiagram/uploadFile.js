import React, { Component } from 'react'
import DropFile from './dropFile';
import Sequence from './sequenceDiagram';



export default class UploadFile extends Component {

    render () {
        return (
            <div className = "content">
                <DropFile />
                <Sequence input={ this.props.input } />
            </div>
        )
    }
}
