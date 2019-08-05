import React from 'react';

function handleRefreshButtonClick (event, refreshFileDirectory){
  event.stopPropagation();
  refreshFileDirectory();
}

function RefreshFileDirectory ({ updateFileDirectory }){
  return (
    <div id="refresh" className="btn icon-btn" onClick={(event) => { handleRefreshButtonClick(event, updateFileDirectory) }} >
      <i className="fas fa-redo-alt" />
    </div>
  )
}

export default RefreshFileDirectory;