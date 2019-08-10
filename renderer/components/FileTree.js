import React from 'react';
import Directory from './Directory';
import PropTypes from 'prop-types';

const FileTree = ({
  fileTree,
  dblClickHandler,
  clickHandler,
  selectedItem,
  openCreateMenu,
  openMenuId,
  createMenuInfo,
  createMenuHandler,
  createItem,
  renameFlag,
  renameHandler
}) => {
  return (
    <ul className="tree-view list-tree has-collapsable-children">
      <Directory
        directory={fileTree}
        dblClickHandler={dblClickHandler}
        id={fileTree.id}
        clickHandler={clickHandler}
        selectedItem={selectedItem}
        openCreateMenu={openCreateMenu}
        openMenuId={openMenuId}
        createMenuInfo={createMenuInfo}
        createMenuHandler={createMenuHandler}
        createItem={createItem}
        renameFlag={renameFlag}
        renameHandler={renameHandler}
      />
    </ul>
  );
};

FileTree.propTypes = {
  fileTree: PropTypes.object,
  dblClickHandler: PropTypes.func.isRequired,
  clickHandler: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
  openCreateMenu: PropTypes.func.isRequired,
  openMenuId: PropTypes.number,
  createMenuInfo: PropTypes.object,
  createMenuHandler: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  renameFlag: PropTypes.bool.isRequired,
  renameHandler: PropTypes.func.isRequired
};

export default FileTree;