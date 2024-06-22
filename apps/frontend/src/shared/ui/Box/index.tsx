import React, { FC } from 'react';
import styled from 'styled-components';

type Props = {
  content: string;
  backgroundColor: string;
  dimension?: {
    width?: string;
    height?: string;
  };
  index?: number | string;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Content = styled.div<{
  backgroundColor: string;
  width?: string;
  height?: string;
}>`
  background-color: ${(props) => props.backgroundColor};
  min-width: ${(props) => props.width ?? '100px'};
  padding: 0 10px;
  height: ${(props) => props.height ?? '100px'};
  display: flex;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const Text = styled.p`
  text-align: center;
  font-weight: 600;
`;

export const Box: FC<Props> = ({
  content,
  backgroundColor,
  index,
  dimension,
}) => {
  return (
    <Container>
      {index !== undefined && <Text>{index}</Text>}
      <Content
        width={dimension?.width}
        height={dimension?.height}
        backgroundColor={backgroundColor}
      >
        <p>{content}</p>
      </Content>
    </Container>
  );
};
