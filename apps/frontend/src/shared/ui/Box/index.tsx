import React, { FC } from 'react';
import styled from 'styled-components';

type Props = {
  content: string;
  backgroundColor: string;
};

const Container = styled.div`
  display: flex;
`;
const Content = styled.div<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor};
  min-width: 100px;
  padding: 0 10px;
  height: 100px;
  display: flex;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

export const Box: FC<Props> = ({ content, backgroundColor }) => {
  return (
    <Container>
      <Content backgroundColor={backgroundColor}>
        <p>Action {content}</p>
      </Content>
    </Container>
  );
};
