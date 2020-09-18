import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.div`
  height: 35px;
  width: 290px;
  text-align: right;
  font-size: 25px;
  border: 5px solid black;
  user-select: none;
`;

const Input = ({ children }) => <Wrapper>{children}</Wrapper>;

export default Input;
