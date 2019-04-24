import React, { Component } from 'react'
import { readFile } from '../../actions/index';
import { connect } from 'react-redux';

class DropFile extends Component {

    componentDidUpdate (prevProps, prevState) {
        if (prevState.file !== this.state.file) {
            this.props.readFile(this.state.file);
            console.log(this.state)
        }
    }

    state = {
      file:[]
    }

    onChange (e) {
            try {
                let reader = new FileReader();
                let files = e.target.files;
                reader.readAsText(files[0]);

                reader.onload = (e) => {
                    this.setState({
                        file:JSON.parse(e.target.result)
                    })
                }
            } catch (error) {
                return ;
            }
    }


    render () {

        return (
            <div className={ "ui input" } id="form">
                <input  type="file" onChange={ (e)=>this.onChange(e) }/>
                <p>Drag your log file here or click in this area.</p>
            </div>
        )
    }
}

const mapStateToProps = ( state ) => {
    return {
        file: state.rootReducer
    }
}

const mapDispatchToProps = {
    readFile
}

export default connect(mapStateToProps, mapDispatchToProps)(DropFile)