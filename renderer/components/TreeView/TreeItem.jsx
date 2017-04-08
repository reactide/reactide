import React, { PropTypes } from 'react';

export const TreeItem = ({
  component,
  active,
  subcomponents,
  id,
  informations
}) => (
    <li>
      <input type="checkbox" checked={active} id={id} disabled={!active} readOnly/>
      <label className="tree_label" htmlFor={id}>{component}</label>
      {subcomponents && subcomponents.map(i => <ul key={i.id}><TreeItem {...i} /></ul>) }
    </li>
)

export default TreeItem;
