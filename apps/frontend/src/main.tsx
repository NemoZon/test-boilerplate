import * as ReactDOM from 'react-dom/client';
import App from './app/App';
import { store } from './app/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') ?? document.body
);

// @INFO: styled-components is installed, you can use it if you want ;)
// const Container = styled.div``;

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
