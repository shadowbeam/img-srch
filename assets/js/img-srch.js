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
      imgUrl : ""

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

 handleUploadStateChange : function(status){

  if( status.target.readyState == 4 && status.target.status == 200){
    console.log("File Uploaded" + status.target.responseText);
    this.setState({imgUrl : status.target.responseText});
  } 
},

uploadFile: function(){
  var data = new FormData();
  data.append( 'file', this.state.file );

  var request = new XMLHttpRequest();
  request.open('POST', 'file-upload.php', true);
  request.onreadystatechange = this.handleUploadStateChange;

  request.send(data);
},


render: function() {
  return ( 
    <div className="select-box">
    <input type="file" name="file" id="file" className="select-box--inputfile" onChange={this.handleFileDrop} />
    <label htmlFor="file">{this.state.labelValue}</label>
    <img src={this.state.imgUrl}/>
    </div>
    );
}

});

  React.render(
    <ImgSrch/>,
    document.getElementById('img-srch')
    );