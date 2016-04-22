import React, {DOM} from 'react';
let div = DOM.div;

export default React.createClass({

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

    return div({className:'wrapper'},'moduletest')
  }

});
