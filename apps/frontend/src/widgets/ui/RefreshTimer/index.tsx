import { numberToTimeFormat } from '../../../shared';
import { useWebSocket } from '../../../entities';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  background-color: #fbfbfb;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 48px;
`;

const TimerText = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

export const RefreshTimer: FC = () => {
  const [time, setTime] = useState<string>();

  useWebSocket((event) => {
    const data = JSON.parse(event.data);
    const min = numberToTimeFormat(data.creditsRefreshTime.minutes);
    const sec = numberToTimeFormat(data.creditsRefreshTime.seconds);
    setTime(`${min} ${sec}`);
  });

  return (
    <div>
      <p>Next coins update</p>
      <TimerContainer>
        <TimerText>{time}</TimerText>
      </TimerContainer>
    </div>
  );
};
