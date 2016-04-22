'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Module from './components/module';

ReactDOM.render(
	React.createFactory(Module)(),
	document.querySelector('#root')
);
