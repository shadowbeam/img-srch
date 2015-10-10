  var ImgSrch = React.createClass({

    componentDidMount: function() {

    },

    getInitialState: function(){
      return {
        imgUrl: 'http://www.w3schools.com/images/w3schools.png',
        searching: false,
        searched: false
      };
    },

    updateUrl: function(url){
      this.setState({
        imgUrl : url
      });
    },

    searching: function(){
      this.setState({searching : true, searched: true});
    },

    finished: function(){
     this.setState({searching : false});
    },

    render: function() {
      return ( 
        <div className={this.state.searching ? 'img-srch searching' : 'img-srch'}>
        <SelectBox searched={this.state.searched} updateUrl={this.updateUrl} searching={this.searching}/>
        <GooglePane imgUrl={this.state.imgUrl} finished={this.finished}/>
        <Spinner />
        </div>
        );
    }

  });

  var Spinner = React.createClass({

      render: function(){
        return(
          <div className='spinner double-bounce'>
            <div className='double-bounce1'></div>
            <div className='double-bounce2'></div>
          </div>
        );
      }
  });


  var SelectBox = React.createClass({
   getInitialState: function(){
    return{
      labelValue: 'Choose a file',
      file: null
    };
  },

  handleFileDrop: function(e){
    this.props.searching();
   fileName = e.target.value.split( '\\' ).pop();
   this.setState({
    labelValue : fileName + ' selected'
  });
   this.uploadFile(e.target.files[0]);

 },

 handleUploadStateChange : function(status){
  if( status.target.readyState == 4 && status.target.status == 200){
    this.props.updateUrl(status.target.responseText);
  } 
},

uploadFile: function(file){
  var data = new FormData();
  data.append('file', file);

  var request = new XMLHttpRequest();
  request.open('POST', 'file-upload.php', true);
  request.onreadystatechange = this.handleUploadStateChange;

  request.send(data);
},


render: function() {
  return ( 
    <div className={this.props.searched ? 'select-box searched' : 'select-box'} >
    <input type='file' name='file' id='file' className='select-box--inputfile' onChange={this.handleFileDrop} />
    <label htmlFor='file'>{this.state.labelValue}</label>
    </div>
    );
}

});



  var GooglePane = React.createClass({

    getInitialState: function(){
      return{
        frameHtml: ''
      };
    },

    handleStatusChange: function (status) {

      if( status.target.readyState == 4 && status.target.status == 200){
        var data = JSON.parse(status.target.responseText);
        if (data.query.results.resources.content && data.query.results.resources.status == 200) {
          this.setState({frameHtml: data.query.results.resources.content})
        }
        else if (data && data.error && data.error.description) {
          this.setState({frameHtml: data.error.description})
        }
        else{ 
          this.setState({frameHtml: 'Error: Cannot load '})
        }

        this.props.finished();
      }
    },

    loadURL: function (url) {

      var query = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.headers%20where%20url%3D%22' + encodeURIComponent('https://www.google.com/search?tbm=isch&q=' + url) + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

      var request = new XMLHttpRequest();
      request.open('GET', query, true);
      request.onreadystatechange = this.handleStatusChange;

      request.send();
    },


    componentWillReceiveProps: function(){
      console.log('parent props updates' + this.props.imgUrl);
      this.loadURL(this.props.imgUrl);
    },

    render: function() {
      return ( 
        <div className='google-pane'>
        <iframe src = {'data:text/html;charset=utf-8,' + encodeURI(this.state.frameHtml)} sandbox='allow-same-origin allow-scripts'></iframe>
        </div>
        );
    }

  });

  React.render(
    <ImgSrch/>,
    document.getElementById('img-srch')
    );