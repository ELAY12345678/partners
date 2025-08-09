import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { IMAGE_404 } from '../constants';
import { Button, Typography } from 'antd';

const Image = styled.div`
  background-image: url('${IMAGE_404}');
  max-width: 763px;
  width: 100%;
  height: 596px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const Wrapper = styled.div`
  padding-top: 4rem;
  padding-bottom: 4rem;
`;

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <Wrapper className="d-flex flex-column justify-content-center align-items-center">
      <Image />
      <Typography.Title level={3} >Ups, nos perdimos...</Typography.Title>
      <Button type='primary' className="mt-4" onClick={() => navigate('/dashboard')}>
        Volver al inicio
      </Button>
    </Wrapper>
  );
};

export default NotFound;
