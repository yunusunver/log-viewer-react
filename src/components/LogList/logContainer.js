import React, { Component } from 'react'
import { connect } from 'react-redux';
// import JSONTree from 'react-json-tree';
// import { Input } from 'semantic-ui-react';
// import SmoothScroll from 'smooth-scroll';
import Inspector from 'react-json-inspector';
import ScrollToTop from 'react-scroll-up';
import {ignoreCase} from '../../actions/ignore';


class LogContainer extends Component {

    componentDidUpdate(prevProps,prevState){
        if (prevState.ignore !== this.state.ignore) {
            this.props.ignoreCase(this.state.ignore);
            console.log(this.state.ignore);
        }
    
    }
    state={
        ignore:false
    }

    ignore=()=>{
        if(this.state.ignore){
            this.setState({
                ignore:false
            })
        }else{
            this.setState({
                ignore:true
            })
        }
    }

    render () {
        const { file } = this.props;

        return (
            <div>
                <div id="logContainer">
                <button onClick={this.ignore.bind(this)} id="ignoreCaseButton">Ignore Case: {(this.state.ignore).toString()}</button>
                {
                    // file.file.map((d, index)=>(
                    //     <li id={ index + "_0" } key={ index } /*onClick={this.handleClick.bind(this,index)} */>
                    //         <JSONTree 
                    //             data={ d } 
                              
                    //         />
                    //     </li>
                    // ))
                    
                    <Inspector data={file.file} filterOptions={{"ignoreCase":file.ignore}}/>
                   
                }
                 <ScrollToTop showUnder={160}>
                        <span>UP</span>
                </ScrollToTop>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        file: state.rootReducer
    }
}

const mapDispatchToProps={
    ignoreCase
}

export default connect(mapStateToProps,mapDispatchToProps)(LogContainer)