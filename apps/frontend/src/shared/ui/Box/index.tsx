import React, { FC } from 'react';
import styled from 'styled-components';

type Props = {
  content: string;
  backgroundColor: string;
  index?: number | string;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Text = styled.p<{ width?: string }>`
  text-align: center;
  font-weight: 600;
`;

export const Box: FC<Props> = ({ content, backgroundColor, index }) => {
  return (
    <Container>
      {index !== undefined && <Text>{index}</Text>}
      <Content backgroundColor={backgroundColor}>
        <p>Action {content}</p>
      </Content>
    </Container>
  );
};
