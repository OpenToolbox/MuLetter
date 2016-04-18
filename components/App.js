const React = require('react');
let DOM = React.DOM, div = DOM.div;

module.exports = React.createClass({

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    //this.setState({})
  },

  // AJAX calls, etc
  handleClick: function() {
  	alert('hello !');
  },

  render: function() {

    return div({className:'wrapper'},'you are here')
  }

});
