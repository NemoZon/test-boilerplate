import React, { useEffect } from 'react';
import { Arrow, Box, Logo } from '../shared';
import './App.css';
import { $api } from '../shared/api';
import { AxiosResponse } from 'axios';

const App = () => {
  useEffect(() => {
    const res: Promise<AxiosResponse<{ message: string }>> = $api.get('/');
    res.then((r) => {
      console.log(r.data.message);
    });
  }, []);
  return (
    <div>
      <Arrow />
      <Box content="sdvsdv" backgroundColor="red" />
      <Logo title="QUEUE" />
    </div>
  );
};

export default App;
