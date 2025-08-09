import React from 'react';
import styled from 'styled-components';

const Root = styled.hr`
  opacity: 0.4;
  background-color: #707070;
`;

const Divider = props => {
  return <Root {...props} />;
};

export default Divider;
