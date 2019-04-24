import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import UploadFile from './components/UploadDiagram/uploadFile';
import LogList from './components/LogList/logList';

let diagMessage = "";
const DIAG_CLIENT_TO_SPIDR_PREFIX = "Client-->Spidr: ",
DIAG_SPIDR_TO_CLIENT_PREFIX = "Spidr->Client: ";

class App extends Component {

    buildDiagMessage(message, args) {
        let ret = true, msg, argsData;
        
        if (typeof message === "string") {
            msg = message.split("received notification event:");
        }
        else {
            return false;
        }

        if (msg.length === 2) {
            diagMessage = diagMessage + DIAG_SPIDR_TO_CLIENT_PREFIX + msg[1] + "\n";
        }
        else {
            if (message.indexOf("Send ajax request: ") !== -1) {
                msg = message.split("Send ajax request: ");
                if (msg.length === 2) {
                    if (msg[1] === "isAlive") {
                        if (this.isKeepAliveChecked()) {
                            diagMessage = diagMessage + DIAG_CLIENT_TO_SPIDR_PREFIX + msg[1] + "\n";
                        }
                        else {
                            ret = false;
                        }
                    }
                    else if (msg[1] === "notification") {
                        if (this.isLongpollingChecked()) {
                            diagMessage = diagMessage + DIAG_CLIENT_TO_SPIDR_PREFIX + msg[1] + "\n";
                        }
                        else {
                            ret = false;
                        }
                    }
                    else if (msg[1] === "instantmessage") {
                        diagMessage = diagMessage + DIAG_CLIENT_TO_SPIDR_PREFIX + "im sent\n";
                    }
                    else if (msg[1] === "callControl") {
                        if (typeof args === "string") {
                            argsData = JSON.parse(args);
                        }
                        else {
                            argsData = args;
                        }
                        if (argsData.callControlRequest && argsData.callControlRequest.type) {
                            diagMessage = diagMessage + DIAG_CLIENT_TO_SPIDR_PREFIX + argsData.callControlRequest.type + "\n";
                        }
                        else if (argsData) {
                            diagMessage = diagMessage + DIAG_CLIENT_TO_SPIDR_PREFIX + "endCall\n";
                        }
                        else {
                            ret = false;
                        }
                    }
                    else if (msg[1] === "conversation") {
                        if (typeof args === "string") {
                            argsData = JSON.parse(args);
                        }
                        else {
                            argsData = args;
                        }
                        diagMessage = diagMessage + DIAG_CLIENT_TO_SPIDR_PREFIX + msg[1] + "\n";
                    }
                    else {
                        diagMessage = diagMessage + DIAG_CLIENT_TO_SPIDR_PREFIX + msg[1] + "\n";
                    }
                }
            }
            else if (message.indexOf("ajax success: ") !== -1) {
                msg = message.split("ajax success: ");
                if (args && args.url.indexOf("/isAlive") !== -1) {
                    if (this.isKeepAliveChecked()) {
                        diagMessage = diagMessage + DIAG_SPIDR_TO_CLIENT_PREFIX + msg[1] + "\n";
                    }
                    else {
                        ret = false;
                    }
                }
                else if (args && args.url.indexOf("/notification/") !== -1) {
                    if (this.isLongpollingChecked()) {
                        diagMessage = diagMessage + DIAG_SPIDR_TO_CLIENT_PREFIX + msg[1] + "\n";
                    }
                    else {
                        ret = false;
                    }
                }
                else {
                    diagMessage = diagMessage + DIAG_SPIDR_TO_CLIENT_PREFIX + msg[1] + "\n";
                }
            }
            else if (message.indexOf("ajax error: ") !== -1) {
                msg = message.split("ajax error: ");
                diagMessage = diagMessage + DIAG_SPIDR_TO_CLIENT_PREFIX + msg[1] + "\n";
            }
            else if (message.indexOf("FSM received NotificationEvent: ") !== -1) {
                msg = message.split(" @ ")[0].split("FSM received NotificationEvent: ")[1];
                if (msg.indexOf("_GUI") !== -1) {
                    diagMessage = diagMessage + DIAG_CLIENT_TO_SPIDR_PREFIX + msg + "\n";
                }
                else {
                    diagMessage = diagMessage + DIAG_SPIDR_TO_CLIENT_PREFIX + msg + "\n";
                }
            }
            else if (message.indexOf("presence received: ") !== -1) {
                msg = args.name.split("@")[0] + ": " + args.state.split("icon-presence_")[1];
                diagMessage = diagMessage + DIAG_SPIDR_TO_CLIENT_PREFIX + msg + "\n";
            }
            else {
                ret = false;
            }
        }
        return ret;
    }

    isShowDetailsChecked = () => {
        return true;
    }

    isKeepAliveChecked = () => {
        return false;
    }

    isLongpollingChecked = () => {
        return false;
    }

    compose = (file) => {
        let parsedLog, log, idArray=[], i, message, diagReturnValue; // eslint-disable-line

        try {
            for ( i = 0; i < file.file.length; i++ ) {
                log = file.file[i];
                if (typeof log === "object") {
                    parsedLog = log
                } else {
                    parsedLog = JSON.parse(log)
                }

                // if (this.isShowDetailsChecked()) {
                //     message = `${ parsedLog.timestamp } - ${ parsedLog.logger } - ${ parsedLog.level } - ${ parsedLog.message }`;
                // } else {
                //     message = `${ parsedLog.logger } - ${ parsedLog.message }`;
                // }

                if (parsedLog.args) {
                    diagReturnValue = this.buildDiagMessage(parsedLog.message,parsedLog.args);
                } else {
                    diagReturnValue = this.buildDiagMessage(parsedLog.message,null)
                }

                if (diagReturnValue) {
                    idArray.push(i);
                }
            }
        } catch (e) {
            console.log(e)
            return {};
        }
        return {
            msgs: diagMessage,
            ids: idArray
        }
    }

    render () {
        const { file } = this.props;
        const input = this.compose(file);

        return (
            <div className = "ui centered grid" id="centeredGrid">
                <div className = "six wide tablet eight wide computer column" id="firstDiv">
                    <UploadFile input={input}/>
                </div>
                <div className = "ten wide tablet eight wide computer column" id = "logListTheme">
                    <LogList/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        file: state.rootReducer
    }
}

export default connect(mapStateToProps,null)(App);
