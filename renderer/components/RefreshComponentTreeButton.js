import React from 'react';

//declared a function named handleRefreshButtonClick
//takes in 2x arguments
  //the event object produced by the button click in reactide
  //the refreshComponentTree function
function handleRefreshButtonClick(event, refreshComponentTree) {
  //stopPropagation method is fired when this function is fired
  //Stops the bubbling of an event to parent elements, preventing any parent handlers from being notified of the event
  event.stopPropagation();
  //refreshComponentTree is then fired
  refreshComponentTree();
};

//declared a function named RefreshComponentTreeButton
//takes in the the constructComponentTreeObj method in
const RefreshComponentTreeButton = ({ constructComponentTreeObj }) => {
  return (
    <div id="refresh" className="btn icon-btn" onClick={(event) => { handleRefreshButtonClick(event, constructComponentTreeObj) }} >
      <i className="fas fa-redo-alt" />
    </div>
  );
};

export default RefreshComponentTreeButton;