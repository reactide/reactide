import React from 'react';
import PropTypes from 'prop-types';

const Square = (props) => {
  const { handleClick, letter, row, square } = props;
  return (
    <div className="square" onClick={() => {handleClick(row, square)}}>{letter}</div>
  );
};

Square.propTypes = {
  handleClick: PropTypes.func.isRequired,
  letter: PropTypes.string,
  row: PropTypes.number.isRequired,
  square: PropTypes.number.isRequired
};

export default Square;
