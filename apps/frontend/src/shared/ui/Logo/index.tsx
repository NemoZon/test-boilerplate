import React, { FC } from 'react';
import Squares from './images/squares.png';
import styled from 'styled-components';

type Props = {
  title: string;
};

const Container = styled.div`
  position: relative;
`;

const Img = styled.img`
  position: absolute;
  z-index: -1;
  left: 0;
  height: 150%;
  bottom: 0;
  transform: translateY(1em)
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 64px;
  margin-left: 25px;
`;

export const Logo: FC<Props> = ({ title }) => {
  return (
    <Container>
      <Img src={Squares} alt="logo" />
      <Title>{title}</Title>
    </Container>
  );
};
