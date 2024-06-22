import { Box } from '../../../../shared';
import React, { FC } from 'react';

type Props = {
  quantity: number;
  backgroundColor: string;
};

export const Coin: FC<Props> = ({ quantity, backgroundColor }) => {
  return (
    <Box
      backgroundColor={backgroundColor}
      content={`${quantity}`}
      dimension={{ width: '50px', height: '50px' }}
    />
  );
};
