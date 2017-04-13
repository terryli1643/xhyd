import React from 'react';
import ReactDom from 'react-dom';
import { ReactRouter } from './router';
import { Provider } from 'mobx-react';
import * as modle from './model';

import './index.less';

ReactDom.render(
    <Provider {...modle}>
        <ReactRouter />
    </Provider>,
    document.getElementById("root")
);

if (module.hot) {
    module.hot.accept();
}