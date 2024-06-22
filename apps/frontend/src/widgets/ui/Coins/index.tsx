import { Coin, fetchAllActionTypes, useWebSocket } from '../../../entities';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Credit } from '../../../entities/types';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 9px;
`;

export const Coins: FC = () => {
  const dispatch = useAppDispatch();
  const { actionTypes, status: actionTypeStatus } = useAppSelector(
    (state) => state.actionType
  );
  const [credits, setCredits] = useState<Credit[]>([]);

  useEffect(() => {
    if (actionTypeStatus === 'idle') {
      dispatch(fetchAllActionTypes());
    }
  }, []);

  useWebSocket((event) => {
    const data = JSON.parse(event.data);
    setCredits(data.credits || []);
  });

  return (
    <div>
      <p>Your coins</p>
      <Container>
        {Object.keys(actionTypes).length > 0 &&
          credits.length > 0 &&
          credits.map((elem) => {
            return (
              <Coin
                key={elem._id}
                quantity={elem.quantity}
                backgroundColor={actionTypes[elem.ActionType].color}
              />
            );
          })}
      </Container>
    </div>
  );
};
