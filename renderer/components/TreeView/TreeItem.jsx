import React, { PropTypes } from 'react';
import TreeInformation from './TreeInformation.jsx'
export const TreeItem = ({
  component,
  active,
  subcomponents,
  id,
  informations
}) => (
    <li>
      <input type="checkbox" checked={active} id={id} disabled={!active} readOnly/>
      <label className="tree_label" htmlFor={id}>
        {component}
        {informations && <TreeInformation informations={informations} />}
      </label>
      {subcomponents && <ul key={`child_of_${id}`}>{subcomponents.map(i => <TreeItem {...i} />)}</ul> }
    </li>
)

export default TreeItem;
