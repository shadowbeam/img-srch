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
    file : e.target.files[0]
  });
   this.uploadFile();

 },

 uploadFile: function(){
  console.log(this.state.file);

  var data = new FormData();
  data.append( 'file', this.state.file );

  var request = new XMLHttpRequest();
  request.open('POST', 'file-upload.php', true);
  request.send(data);

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