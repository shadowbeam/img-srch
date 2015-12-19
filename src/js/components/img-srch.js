var React = require('react');
var React = require('Spinner');
var React = require('GooglePane');
var React = require('SelectBox');
var React = require('CroppingTool');


var guid = function() {

    var nav = window.navigator;
    var screen = window.screen;
    var guid = nav.mimeTypes.length;
    guid += nav.userAgent.replace(/\D+/g, '');
    guid += nav.plugins.length;
    guid += screen.height || '';
    guid += screen.width || '';
    guid += screen.pixelDepth || '';

    return guid;
};

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
                        return <SelectBox imgSrchState={this.target.imgSrchState()} />;
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
                    transition: function(){
                        this.target.changeState(this.target.states.searched);
                    },
                    render: function(){
                        console.log(this.target.that.state.file);
                        return <CroppingTool file={this.target.getFile()} imgSrchState={this.target.imgSrchState()} />;
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
                        return <div className='searched state'>
                        <GooglePane imgUrl={this.target.getImgURL()} imgSrchState={this.target.imgSrchState()}/>
                        <SelectBox imgSrchState={this.target.imgSrchState()}/>
                        </div>;

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

            loading: function(){
                this.changeState(this.states.loading);
            },

            getFile: function(){
                return this.that.state.file;
            },

            getImgURL: function(){
                return this.that.state.imgUrl;
            },

            setImgURL: function(url){
                this.that.state.imgUrl = url;
            },

            fileSelected: function(file){
                this.that.fileSelected(file);
            },

            imgSrchState: function(){
                return this.that.state.imgSrchState;
            },

            transition: function(){
                this.that.state.state.transition();
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

module.exports = ImgSrch;