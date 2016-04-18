let React = require('react'),
ReactDOM = require('react-dom'),
App = require('./components/App');

ReactDOM.render(
	React.createFactory(App)(),
	document.querySelector('#root')
);
