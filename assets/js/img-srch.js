  var ImgSrch = React.createClass({

    componentDidMount: function() {

    },

    getInitialState: function(){
      return {
        imgUrl: 'http://www.w3schools.com/images/w3schools.png',
        searching: false,
        searched: false,

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
      <SelectBox updateUrl={this.updateUrl} searching={this.searching}/>
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

        console.log(data);

      }
      this.props.finished();
    },

    loadURL: function (url) {

      var request = new XMLHttpRequest();
      request.open('GET', "assets/php/scraper.php?url=" + url, true);
      request.onreadystatechange = this.handleStatusChange;

      request.send();
    },


    componentDidUpdate: function(prevProps, prevState){
      if(prevProps.imgUrl != this.props.imgUrl){
        console.log('parent props updates' + this.props.imgUrl);

        this.loadURL(this.props.imgUrl);
      }
    },

    render: function() {
      return ( 
        <div className='google-pane'>
        </div>
        );
    }

  });

  React.render(
    <ImgSrch/>,
    document.getElementById('img-srch')
    );