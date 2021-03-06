import React from 'react';
import CreateProjectTagItem from './createproject-tag-item.js';


var inputs= [];
var numTags = 0;
export default class CreateProjectTagSection extends React.Component {
  constructor(props) {

        super(props);
        this.state = { inputs };

    }

getInputs(){
  return inputs;
}

    addNewButton(value){
      if (value != "" && numTags < 5){
      var newInput =  <a href = "#"><div className = "singleTag"><CreateProjectTagItem tag={value} /></div></a>;
      inputs.push(newInput);
      this.setState({inputs})
      
      numTags++;

    }
  }

    removeButton(){
      if (numTags > 0){
        inputs.splice((numTags-1), 1);
        this.setState({inputs});
        numTags--;
      }
    }




  render() {
    return (


      <div>

        <div className= "attribute-box">
         <div className= "attribute">Areas of Interest (5 Max):</div>
         <input placeholder="Add Tags" ref={node => {
                 this.input = node;
               }} />
             <button type="button" id="add-more-tags-btn" className="btn btn-default" onClick={ () => this.addNewButton(this.input.value)  }>
           Add Tag
           </button>
           <button type="button" id="remove-tags-btn" className="btn btn-default" onClick={ () => this.removeButton()  }>
         Remove Tag
         </button>
          <div>
              {inputs}
          </div>
        </div>


</div>
);
}
}
