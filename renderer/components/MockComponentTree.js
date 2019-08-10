import React from 'react';

class MockComponentTree extends React.PureComponent {
  constructor(props) {
    super(props);
  }


  // input for renderChildrenTrees is an array of objects
  renderChildrenTrees(children) {
    // children should be an array
    // children are the children components
    // if (children.length) should work 
    if (children && children.length) {
      let renderArr = [];
      children.forEach(elem => {
        // push resolved value of invoking renderTree on each element
        renderArr.push(this.renderTree(elem));
      })
      // for every elemnt of the renderArr, we create a list items to 'tree_rows' unordered list
      return (<ul className="tree_rows">{renderArr}</ul>);
    }
  }

  // this renders the stateProps passed to it
  // stateProps expected to be an object 
  renderStateProps(stateProps) {

    if (stateProps && Object.keys(stateProps).length) {
      let renderArr = [];
      // creates a list item of each element in stateProps object and pushes it to the renderArr array
      Object.keys(stateProps).forEach(key => {
        
        let value = typeof stateProps[key] === 'Object' ? stateProps[key] : JSON.stringify(stateProps[key])
        renderArr.push(<li>{key} :{value}</li>)
      })
       
      // here, we render each <li> in the renderArr array as children of an unordered list with a className of 'state_props'
      return (
        <ul className="state_props">
          {renderArr}
        </ul>
      );
    }
  }

  // this renders the childProps passed to it
  // childProps expected to be an array of objects
  renderChildProps(childProps) {
    // this conditional asks if childProps even exists
    if (childProps && childProps.length > 0) {
      let renderArr = [];
      // used forEach iterator to iterate over inputted childProps array
      childProps.forEach(elem => {
        // creates a list item of each element in childProps array and pushes it to the renderArr array
        renderArr.push(<li>{elem.name}
          <ul className="comp_props">
            {Object.keys(elem.props).map(key =>
              <li>{key}: <i>{elem.props[key]}</i></li>
            )}
          </ul>
        </li>);
      });
      // here, we render each <li> in the renderArr array as children of an unordered list with a className of 'comp_refs'
      return (
        <ul className="comp_refs">
          {renderArr}
        </ul>
      );
    }
  }

  // this method renders the entire tree
  renderTree(treeObj) {
    // we deconstructe the inputted treeObj to access these properties
    const { name, stateProps, childProps, children } = treeObj;
    //renderArr isn't used
    let renderArr = [];
    // here, we return the DOM for the Component Tree
    // this is the first element appened to the DOM
    // has a className of tree_row
    // inside of <li> w/ className of 'tree_row', there is an <input> element and a <label> element
    // when stateProps or childProps have lengths greater than 0, <div> element and <span> elements are added to the DOM
    // if stateProps has a length greater than 0, we appened React.Fragment that includes an <input> element, a <label> element, and the result of invoking renderStateProps w/ stateProps passed in as argument  
    // if childProps has a length greater than 0, we appened React.Fragment that includes an <input> element, a <label> element, and the result of invoking renderchildProps w/ childProps passed in as argument
    // last element in <li> is the returned value of invoking renderChildrenTrees w/ children argument passed to it
    return (
      <li key={'ct_node-li' + name} className="tree_row">
        <input type="checkbox" id={'ct_node-npt_' + name} key={'ct_node-npt_' + name} />

        <label key={'ct_node-lbl_' + name} id={'ct_node-lbl_' + name} className="tree_node" htmlFor={'ct_node-npt_' + name}>{name}</label>

        {(Object.keys(stateProps).length > 0 || childProps.length > 0) && (
          <div className="props-container">
            <span className="props-form">
              {Object.keys(stateProps).length && (
                <React.Fragment>
                  <input type="checkbox" id={"ct_state-npt_" + name} />
                  <label htmlFor={"ct_state-npt_" + name}>[state_props] ({Object.keys(stateProps).length})</label><br />
                  {this.renderStateProps(stateProps)}
                </React.Fragment>)}
              {childProps.length > 0 && (
                <React.Fragment>
                  <input type="checkbox" id={"ct_child-npt_" + name} />
                  <label htmlFor={"ct_child-npt_" + name}>[comp_props] ({childProps.length})</label><br />
                  {this.renderChildProps(childProps)}
                </React.Fragment>)}
            </span>
          </div>
        )}
        {this.renderChildrenTrees(children)}
      </li>
    );
  }
  // we render an <ul> w/ a className of 'tree' that displays the return value of invoking renderTree and passing the value stored in props object at the componentTreeObj property
  render() {
    let componentTree = [];

    return (
      <ul className="tree">
        {this.renderTree(this.props.componentTreeObj)}
      </ul>
    );
  }
}
export default MockComponentTree;
