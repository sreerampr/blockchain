var React = require('react');
var NavBar = require('../../components/Navbar/Navbar');

var Home = React.createClass({
    componentWillMount: function() {
        sessionStorage.clear();
    },
  render: function() {
    return (
        <div>
            <NavBar/>
            Successfully logged out!
        </div>
    );
  }
});

module.exports = Home;