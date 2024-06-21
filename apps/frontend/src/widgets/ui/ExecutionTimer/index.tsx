import { deleteActionById } from '../../../entities/action/slices';
import { useAppDispatch } from '../../../app/hooks';
import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useWebSocket } from '../../../entities';

const Text = styled.h1`
  font-size: 32px;
  font-weight: bold;
`;

export const ExecutionTimer: FC = () => {
  const dispatch = useAppDispatch();
  const [countdown, setCountdown] = useState(null);

  useWebSocket((event) => {
    const data = JSON.parse(event.data);    
    setCountdown(data.countdown);
    if (data.lastDeleted) {
      dispatch(deleteActionById(data.lastDeleted));
    }
  })

  return <Text>Next execution: {countdown}s</Text>;
};
