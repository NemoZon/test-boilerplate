import React, { FC } from 'react';
import { ActionList, ExecutionTimer } from '../../widgets';
import { AddAction } from '../../widgets/';
import styled from 'styled-components';
import { Logo } from '../../shared';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  padding: 0px 50px;
`;

const BottomContainer = styled.div`
  margin: 0 0 30px 0;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0 0 0;
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 30px 0;
`;

export const Queue: FC = () => {
  return (
    <Container>
      <TopContainer>
        <Logo title={'QUEUE'} />
      </TopContainer>
      <div>
        <CenterContainer>
          <ExecutionTimer />
        </CenterContainer>
        <ActionList />
      </div>
      <BottomContainer>
        <AddAction />
      </BottomContainer>
    </Container>
  );
};