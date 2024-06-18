import { createAction, fetchAllActionTypes } from '../../../entities';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import React, { FC, useEffect } from 'react';
import { ActionType } from '../../../entities/types';
import { Box } from '../../../shared';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 5px;
`;
const Text = styled.p`
  font-size: 16px;
  font-weight: 600;
`;
const Button = styled.button`
  padding: 0;
  border: 1px solid transparent;
  border-radius: 10px;
  transition: all 0.3s ease;
  &:hover {
    cursor: pointer;
    border: 1px solid black;
  }
`;
export const AddAction: FC = () => {
  const dispatch = useAppDispatch();

  const { actionTypes, status: actionTypeStatus } = useAppSelector(
    (state) => state.actionType
  );

  useEffect(() => {
    if (actionTypeStatus === 'idle') {
      dispatch(fetchAllActionTypes());
    }
  }, [dispatch]);

  const handleClick = (type: ActionType) => {
    dispatch(createAction(type._id));
  };

  return (
    <Container>
      <Text>Click to add to the queue</Text>
      <Content>
        {actionTypes &&
          Object.values(actionTypes).map((type) => {
            return (
              <Button
                key={type._id}
                type="button"
                onClick={() => handleClick(type)}
              >
                <Box backgroundColor={type.color} content={type.name} />
              </Button>
            );
          })}
      </Content>
    </Container>
  );
};
