import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import styled from 'styled-components';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.body
);

// @INFO: styled-components is installed, you can use it if you want ;)
const Container = styled.div``;

root.render(
  <StrictMode>
    <Container>Good luck !</Container>
  </StrictMode>
);
