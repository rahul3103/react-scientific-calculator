import React from 'react';

const Button = (props) => {

  // the props used:
  // className for css coloring
  // value is the actual value used for operations
  // onClick is the click method
  // disabled is used to disable/enable buttons (mainly used for radians and degrees)
  const { className, value, onClick, label, disabled } = props;

  return (
    <button className={className}
      onClick={() => onClick(value)}
      disabled={disabled}>
      {label}
    </button>
  )
}

export default Button;
