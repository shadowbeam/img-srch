
var ImagePreview = React.createClass({

    render: function(){
        return  <div className='image-preview'>
        <img className='target-image' src={this.props.imgUrl}/>
        </div>;
    }
});