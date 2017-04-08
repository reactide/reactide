import React, { PropTypes } from 'react'
import TreeItem from './TreeItem.jsx'

const MOCK = {
    component: 'app',
    id: 'a1',
    active: true,
    subcomponents: [{
      component: 'header',
      id: 'c1',
      active: true,
      subcomponents: [{
        component: 'h1',
        id: 'c2',
        active: true,
        subcomponents: [{
          component: 'app',
          id: 'c14',
          active: false,
        },{
          component: 'app',
          id: 'c15',
          active: false,
        }]
      }]
    }, {
      component: 'Looong level 1 label text',
      id: 'c3',
      active: true,
      subcomponents: [{
        component: 'Level 2',
        id: 'c13',
      },{
        component: 'Sample',
        id: 'c4',
        active: true,
        informations: {
          type: 'input',
          className: 'new-todo',
          type: 'text',
          placeholder: 'What needs to be done?',
          autoFocus: true,
          value: '',
        },
        subcomponents: [{
          component: 'Level 3',
          id: 'c12',
        }]
      }]
    }]
}

export const TreeView = () => (
  <div className="item-views">
    <div className="styleguide pane-item">
      <header className="styleguide-header">
        <h5>Component Tree</h5>
      </header>

      <main className="styleguide-sections">

        <div className="tree-view-resizer tool-panel">
          <div className="tree-view-scroller">

            <ul className="tree">
              <TreeItem {...MOCK} />
            </ul>

          </div>
        </div>

      </main>
    </div>
  </div>
)

export default TreeView;
