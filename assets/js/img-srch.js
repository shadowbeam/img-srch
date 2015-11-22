var ImgSrch = React.createClass({


    getInitialState: function(){

        var imgSrch = {   
            that: undefined,
            states: {
                waiting: {
                    initialize:function(target){
                        this.target = target;
                    },
                    toString: function(){
                        return 'waiting';
                    },
                    render: function(){
                        return <SelectBox imgSrchState={this.target.imgSrchState()}  fileSelectedCallback={this.target.that.fileSelected}/>;
                    }
                },       
                loading: {
                    initialize:function(target){
                        this.target = target;
                    },
                    toString: function(){
                        return "loading";
                    },
                    render: function(){
                        return;
                    }
                },  
                cropping: {
                    initialize:function(target){
                        this.target = target;
                    },
                    toString: function(){
                        return 'cropping';
                    },
                    render: function(){
                        console.log(this.target.that.state.file);
                        return <CroppingTool file={this.target.that.state.file} imgSrchState={this.target.imgSrchState()} />;
                        // <ConfirmCropBox imgSrchState={this.target.that.state.imgSrchState}/>;
                    }
                },
                searched: {
                    initialize:function(target){
                        this.target = target;
                    },
                    toString: function(){
                        return 'searched';
                    },
                    render: function(){
                        return <GooglePane imgUrl={this.target.that.state.imgUrl}/>;
                        // <SelectBox imgSrchState={this.state.imgSrchState}  fileSelectedCallback={this.fileSelected}/>;

                    }
                },

            },
            initialize: function() {
                this.states.waiting.initialize(this);
                this.states.loading.initialize(this);
                this.states.searched.initialize(this);
                this.states.cropping.initialize(this);

                this.that.setState({state: this.states.waiting});
            },

            setImgURL: function(url){
                this.that.state.imgUrl = url;
            },

            imgSrchState: function(){
                return this.that.state.imgSrchState;
            },

            changeState: function(state) {
                this.that.setState({state: state});

            }
        };

        imgSrch.that = this;
        imgSrch.initialize();


        return {
            imgUrl: '',
            imgSrchState: imgSrch,
            state: imgSrch.states.waiting,
            file: ''
        };
    },

    fileSelected: function(file){
        this.state.file = file;
        this.setState({
            file: file,
            state: this.state.imgSrchState.states.cropping
        });
    },

    makeClassname: function(){
        return 'img-srch ' + this.state.state.toString();
    },

    render: function() {
        var node = this.state.state.render();

        return <div className={this.makeClassname()}>
        {node}
        <Spinner />
        </div>;
    }
});

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
            this.props.imgSrchState.changeState(this.props.imgSrchState.states.searched);
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

    render: function(){
      return <div className='cropping-tool'>
      <div className='img-container'>
      <img id='target-img' className='target-img' src={this.state.fileSrc}/>
      </div>
      <button onClick={this.cropImage} id='crop'>Crop</button>
      </div>;
  }
});

var Spinner = React.createClass({

    render: function(){
      return <div className='spinner double-bounce'>
      <div className='double-bounce1'></div>
      <div className='double-bounce2'></div>
      </div>;
  }
});


var SelectBox = React.createClass({
    getInitialState: function(){
        return{
            labelValue: 'Choose a file',
            file: null,
            searched: false
        }
    },

    handleFileDrop: function(e){
        this.props.imgSrchState.changeState(this.props.imgSrchState.states.loading);
        fileName = e.target.value.split( '\\' ).pop();
        this.setState({ 
            labelValue : fileName + ' selected',
            searched: true
        });
        this.props.fileSelectedCallback(e.target.files[0]);       
    },

    makeSelectBoxClassName: function(){
        var searched = this.state.searched ? 'searched' : '';
        return 'select-box ' + searched;
    },


    render: function() {
        return <div className={this.makeSelectBoxClassName()}>
        <input type='file' name='file' id='file' className='select-box--inputfile' onChange={this.handleFileDrop} />
        <label htmlFor='file'>{this.state.labelValue}</label>
        </div>;
    }

});

var GooglePane = React.createClass({

    getInitialState: function(){
        return{ 
            imgJson: [{}],
            //scraper: 'assets/php/scraper.php?url='
            scraper: 'test/php/scraper-mock.php?url='
        };
    },

    handleStatusChange: function (status) {
        if( status.target.readyState == 4 && status.target.status == 200){
            var data = JSON.parse(status.target.responseText);
            this.setState({ imgJson: data });
        }
        this.props.finished();
    },

    loadURL: function (url) {
        var request = new XMLHttpRequest();
        request.open('GET', this.state.scraper + url, true);
        request.onreadystatechange = this.handleStatusChange;
        request.send();
    },


    componentDidUpdate: function(prevProps, prevState){
        if(prevProps.imgUrl != this.props.imgUrl){
            this.loadURL(this.props.imgUrl);
        }
    },

    render: function() {
        var images = this.state.imgJson.map(function (img) {
            return <ImageResult title={img.title} image={img} description={img.description} cite={img.cite} url={img.url}/>;
        });

        return <div className='google-pane'>
        <ImagePreview imgUrl={this.props.imgUrl}/>
        <div className='image-results'>
        {images}
        </div>
        </div>;

    }

});

var ImagePreview = React.createClass({

    render: function(){
        return  <div className='image-preview'>
        <img className='target-image' src={this.props.imgUrl}/>
        </div>;
    }
});

var ImageResult = React.createClass({

    createMarkup: function(html){ 
        return {__html: html};
    },

    render: function() {
        return <div className='image-result' ref='image-result'>
        <h2><a href={this.props.url}>{this.props.title}</a></h2>
        <h3 dangerouslySetInnerHTML={this.createMarkup(this.props.cite)}></h3>
        <p dangerouslySetInnerHTML={this.createMarkup(this.props.description)}></p>
        </div>;
    }
});

React.render(<ImgSrch/>, document.getElementById('img-srch'));