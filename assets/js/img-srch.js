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
   getInitialState: function(){
    return{
      labelValue: "Choose a file",
      data_uri: null

    };
  },

  handleFileDrop: function(e){
   fileName = e.target.value.split( '\\' ).pop();
   this.setState({
    labelValue : fileName + ' selected',
    data_uri : e.target.result
  });
   this.uploadFile();

 },

 uploadFile: function(){

  var request = new XMLHttpRequest();
  request.open('POST', '/my/url', true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  request.send(this.state.data_uri);

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