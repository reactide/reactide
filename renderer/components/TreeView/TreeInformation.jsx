import React, { PropTypes } from 'react';

export const TreeInformation = ({ informations }) => (
  <span className="tree_custom">
    { Object.keys(informations).map(k => (
        <span style={{display: "block"}}>
          {k}: <span className="text-info">{informations[k]}</span>
        </span>
    ))}
  </span>
)

export default TreeInformation;
