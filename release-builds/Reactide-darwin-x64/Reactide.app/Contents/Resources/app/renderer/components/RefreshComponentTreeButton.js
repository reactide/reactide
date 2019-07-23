import React from 'react';

function handleRefreshButtonClick(event, refreshComponentTree) {
  event.stopPropagation();
  refreshComponentTree();
};

const RefreshComponentTreeButton = ({ constructComponentTreeObj }) => {
  return (
    <div className="btn icon-btn" onClick={(event) => { handleRefreshButtonClick(event, constructComponentTreeObj) }} >
      <i className="fas fa-redo-alt" />
      Refresh
    </div>
  );
};

export default RefreshComponentTreeButton;