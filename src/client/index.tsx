import './index.less';

import App from './app';
import React from 'react';
import { render } from 'react-dom';

render(
  <App />,
  document.getElementById('app')
);

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept()
}
