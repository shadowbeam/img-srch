  var ImgSrch = React.createClass({

    componentDidMount: function() {

    },

    getInitialState: function(){
      return {
        searched: false
      };
    },

    render: function() {
      return ( 
        <SelectBox/>
        );
    }

  });


  var SelectBox = React.createClass({

   componentDidMount: function() {

   },

   getInitialState: function(){
    return{};
  },

  render: function() {
    return ( 
      <div className="select-box">
      <input type="file" name="file" id="file" className="select-box--inputfile" />
      <label for="file">Choose a file</label> 
      </div>
      );
  }


});

  React.render(
    <ImgSrch/>,
    document.getElementById('img-srch')
    );