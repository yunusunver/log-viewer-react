import React, { Component } from 'react'
import $ from 'jquery';
import SequenceDiagram from 'react-sequence-diagram';

let elements = [];

class Sequence extends Component {

    textSelector = () => {
        // return document.querySelector(".signal path[marker-end*='url']");
        return $("#diagram path[marker-end*='url']").prev('text');
    }

    componentDidUpdate () {
        const { input } = this.props;

        elements = this.textSelector();

        input.ids.map((i,index) =>
            elements[index].setAttribute("id",i)
        )

        elements.on('click', function () {
            if(document.querySelector(`div[id='leaf-.root.${this.id}']`) != null){
               
                $("#logContainer div[style='background-color: yellow;']").css('background-color', 'white');
                $(`#logContainer  div[id='leaf-.root.${this.id}']`).css("background-color", "yellow");
                elements.css("fill", "black");
                $(this).css("fill", "red");
                // const aaa=document.querySelector("#logContainer #leaf-.root." + this.id);
                $('#logListTheme').animate({
                    scrollTop: $(`div[id='leaf-.root.${this.id}']`).offset().top
                }, 400);
            }
        })

    }

    render() {
        const { input } = this.props;
        return (
            <div>
                <div className="row" id="sequenceDiagramRow">
                      <div className="large-12 columns">
                            <div id="diagram">
                                { 
                                    <SequenceDiagram
                                        input={ input.msgs }
                                        options={ {theme: 'simple'} }
                                        className={ "signal" }
                                        idsArray={ input.ids }
                                    />
                                }
                            </div>
                      </div>
                </div>
            </div>
        )
    }
}


export default Sequence