var ImageResult = React.createClass({

    componentDidMount: function(){
        var image = document.querySelector('.img-container > img');
        var minAspectRatio = 1;
        var maxAspectRatio = 2;


        var cropper = new Cropper(image);
    } ,


    render: function() {
        return <div className='img-container'>
        <img src='http://localhost/tglg/images/home/top.jpg'/>
        </div>;
    }
});

React.render(<ImageResult/>, document.getElementById('img-srch'));

