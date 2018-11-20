import React from 'react';
import { findDOMNode } from 'react-dom';

class MockComponentTree extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  renderChildrenTrees(children) {
    if (children && children.length) {
      let renderArr = [];
      children.forEach(elem => {
        renderArr.push(this.renderTree(elem));
      })
      return (<ul className="tree_rows">{renderArr}</ul>);
    }
  }

  renderStateProps(stateProps) {
    if (stateProps && stateProps.length) {
      let renderArr = [];
      stateProps.forEach(elem => {
        renderArr.push(<li>{elem}</li>)
      });
      return (
        <ul className="state_props">
          {renderArr}
        </ul>
      );
    }
  }

  renderChildProps(childProps) {
    if (childProps && childProps.length > 0) {
      let renderArr = [];
      childProps.forEach(elem => {
        renderArr.push(<li>{elem.name}
          <ul className="comp_props">
            {Object.keys(elem.props).map(key =>
              <li>{key}: <i>{elem.props[key]}</i></li>
            )}
          </ul>
        </li>);
      });
      return (
        <ul className="comp_refs">
          {renderArr}
        </ul>
      );
    }
  }

  renderTree(treeObj) {
    const { name, stateProps, childProps, children } = treeObj;
    let renderArr = [];

    return (
      <li key={'ct_node-li' + name} className="tree_row">
        <input type="checkbox" id={'ct_node-npt_' + name} key={'ct_node-npt_' + name} />
        <label key={'ct_node-lbl_' + name} id={'ct_node-lbl_' + name} className="tree_node" htmlFor={'ct_node-npt_' + name}>{name}</label>
        {(stateProps.length > 0 || childProps.length > 0) && (
          <div className="props-container">
            <span className="props-form">
              {stateProps.length > 0 && (
                <React.Fragment>
                  <input type="checkbox" id={"ct_state-npt_" + name} />
                  <label htmlFor={"ct_state-npt_" + name}>[state_props] ({stateProps.length})</label><br />
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
