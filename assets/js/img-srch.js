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
                        return;
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
                        return <CroppingTool file={this.target.that.state.file}/>;
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
                        return <GooglePane imgUrl={this.that.state.imgUrl}/>;                        
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

    updateUrl: function(url){
        this.setState({ imgUrl: url});
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

        <SelectBox imgSrchState={this.state.imgSrchState}  fileSelectedCallback={this.fileSelected}/>
        {node}
        <Spinner />
        </div>;
    }
});

var CroppingTool = React.createClass({

    getInitialState: function(){
        return { fileSrc : ''};
    },

    componentDidMount: function(){
        this.readFile();  
        this.darkroomInit();
    } ,

    componentDidUpdate: function(prevProps, prevState){
        if(prevState.fileSrc != this.state.fileSrc){
            this.readFile();
            this.darkroomInit();
        }  
    },

    darkroomInit: function(){
        new Darkroom('#target-img', {
            minWidth: 100,
            minHeight: 100,
            maxWidth: 500,
            maxHeight: 500,
            plugins: {
                crop: {
                    minHeight: 50,
                    minWidth: 50,
                },
                save: false // disable plugin
            },
            initialize: function() {
                this.plugins['crop'].requireFocus();

                this.addEventListener('core:transformation', function() { 
                });
            }
        });
    },

    readFile: function(){
        var reader = new FileReader();
        var that = this;
        reader.onloadend = function(){
            that.setState({fileSrc: reader.result});
        }
        reader.readAsDataURL(this.props.file);
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

    render: function(){
      return <div className='cropping-tool'>
      <img id='target-img' className='target-img' src={this.state.fileSrc}/>
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
        return <div className='image-result'>
        <h2><a href={this.props.url}>{this.props.title}</a></h2>
        <h3 dangerouslySetInnerHTML={this.createMarkup(this.props.cite)}></h3>
        <p dangerouslySetInnerHTML={this.createMarkup(this.props.description)}></p>
        </div>;
    }
});

React.render(<ImgSrch/>, document.getElementById('img-srch'));