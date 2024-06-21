import React, { FC, useEffect, useState } from 'react';
import styled, { FlattenSimpleInterpolation } from 'styled-components';

export enum TimerTypeEnum {
  Default = 'DEFAULT',
  SOnly = 'SONLY',
}
type Props = {
  type?: TimerTypeEnum;
  endTime: Date;
  customCSS?: FlattenSimpleInterpolation;
  onTimerEnd: () => void;
};

const Title = styled.p<{ customCSS?: FlattenSimpleInterpolation }>`
  font-weight: bold;
  font-size: 64px;
  margin-left: 25px;
  ${($props) => $props?.customCSS || ''}
`;

export const numberToTimeFormat = (n: number): string => {
  return n < 10 && n >= 0 ? `0${n}` : `${n}`;
};

export const Timer: FC<Props> = ({
  endTime,
  customCSS,
  onTimerEnd,
  type = TimerTypeEnum.Default,
}) => {
  const [timeToPrint, setTimeToPrint] = useState<string>('');

  const getTime = (msLeft: number) => {
    if (type === TimerTypeEnum.Default) {
        const minutes = Math.floor(msLeft / 60_000);
        const seconds = Math.floor((msLeft - minutes * 60_000) / 1_000);
        setTimeToPrint(
          `${numberToTimeFormat(minutes)} ${numberToTimeFormat(seconds)}`
        );
    } else if (type === TimerTypeEnum.SOnly) {
        setTimeToPrint(
            `${numberToTimeFormat(Math.floor(msLeft / 1_000))}s`
        );
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      const timeLeftInMs = endTime.getTime() - new Date().getTime();
      if (timeLeftInMs >= 0) {
        getTime(timeLeftInMs);
      } else {
        onTimerEnd();
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return (
    <Title customCSS={customCSS}>
      {timeToPrint}
    </Title>
  );
};
