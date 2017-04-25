import React from 'react';


import CreateProjectSinglePosition from './createproject-single-position.js'
var inputs= [];
export default class CreateProjectPositionSection extends React.Component {

  constructor(props) {

        super(props);
        this.state = { inputs: [<CreateProjectSinglePosition />, <CreateProjectSinglePosition />, <CreateProjectSinglePosition />] };
    }

    addNewButton(){
      var newInput = <CreateProjectSinglePosition />
      inputs.push(newInput);
      this.setState({inputs})
    }

getPositions(){
  return inputs;
}


  render() {

    return (


      <div>

        <div className = "attribute-box" id="positions">
        <div className = "attribute">Positions:</div>
        <div>
          <CreateProjectSinglePosition />
          {inputs}
        </div>
      </div>
        <button type="button" id="add-more-btn" className="btn btn-default" onClick={ () => this.addNewButton() }>
        Add More...
        </button>

</div>
);
}
}