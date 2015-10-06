  var ImgSrch = React.createClass({

    componentDidMount: function() {

    },

    getInitialState: function(){
      return {
        searched: false
      };
    },

    render: function() {
      return ( <button>Search</button> );
    }

  });


  React.render(
    <ImgSrch/>,
    document.getElementById('img-srch')
    );