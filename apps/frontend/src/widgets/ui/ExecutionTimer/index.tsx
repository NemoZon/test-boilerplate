import { deleteActionById } from '../../../entities/action/slices';
import { useAppDispatch } from '../../../app/hooks';
import { URL_WSS } from '../../../shared';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

const Text = styled.h1`
  font-size: 32px;
  font-weight: bold;
`;

export const ExecutionTimer: FC = () => {
  const dispatch = useAppDispatch();
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(URL_WSS);

    ws.onopen = () => {
      console.log('Connected to the wss');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCountdown(data.countdown);
      if (data.lastDeleted) {
        dispatch(deleteActionById(data.lastDeleted));
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from the wss');
    };

    return () => {
      ws.close();
    };
  }, []);

  return <Text>Next execution: {countdown}s</Text>;
};
