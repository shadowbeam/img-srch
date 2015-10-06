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



   handleFileDrop: function(e){
     fileName = e.target.value.split( '\\' ).pop();
     this.setState({labelValue : fileName + ' selected'});
   },

   getInitialState: function(){
    return{
      labelValue: "Choose a file"
    };
  },

  render: function() {
    return ( 
      <div className="select-box">
      <input type="file" name="file" id="file" className="select-box--inputfile" onChange={this.handleFileDrop} />
      <label htmlFor="file">{this.state.labelValue}</label> 
      </div>
      );
  }


});

  React.render(
    <ImgSrch/>,
    document.getElementById('img-srch')
    );