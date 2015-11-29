var CroppingTool = React.createClass({

    getInitialState: function(){
        return { fileSrc : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs='};
    },

    componentDidMount: function(){
        this.readFile();  
    } ,

    componentDidUpdate: function(prevProps, prevState){
        if(prevState.fileSrc != this.state.fileSrc){
            this.readFile();
        }  
    },

    croppingToolInit: function(){
        if(this.state.cropper == undefined){
            var image = document.querySelector('.img-container > img');
            this.state.cropper = new Cropper(image, {
              moveable: false,
              autoCrop: false
          });
        }

    },

    cropImage: function(){
        var canvas = this.state.cropper.getCroppedCanvas();
        if(!canvas){
            canvas = this.state.cropper.canvas;
        }
        this.uploadFile(canvas.toDataURL());
    },

    readFile: function(){
        var reader = new FileReader();
        var that = this;
        reader.onloadend = function(){
            that.setState({fileSrc: reader.result});
            that.croppingToolInit();
        }
        reader.readAsDataURL(this.props.file);
    },

    handleUploadStateChange : function(status){
        if( status.target.readyState == 4 && status.target.status == 200){
            this.props.imgSrchState.setImgURL(status.target.responseText);
            this.props.imgSrchState.transition();
        } 
    },

    uploadFile: function(file){
        var data = new FormData();
        data.append('file', file);
        data.append('guid', guid());

        var request = new XMLHttpRequest();
        request.open('POST', 'file-upload.php', true);
        request.onreadystatechange = this.handleUploadStateChange;

        request.send(data);
    },

    render: function(){
      return <div className='cropping-tool'>
      <div className='img-container'>
      <img id='target-img' className='target-img' src={this.state.fileSrc}/>
      </div>
      <button onClick={this.cropImage} id='crop'>Crop</button>
      </div>;
  }
});
