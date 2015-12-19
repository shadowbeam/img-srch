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