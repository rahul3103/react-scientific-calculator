import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

const ButtonDiv = styled.div`
  width: 75px;
  background: greenyellow;
  border: 1px solid black;
  padding: 10px 20px;
  color: black;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  user-select: none;
`;

const Button = ({ className, value, onClick, label, disabled }) => (
  <ButtonDiv
    className={className}
    onClick={() => onClick(value)}
    disabled={disabled}
  >
    {label}
  </ButtonDiv>
);

export default Button;

Button.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  className: '',
  disabled: false,
};
