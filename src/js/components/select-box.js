var SelectBox = React.createClass({
    getInitialState: function(){
        return{
            labelValue: 'Choose a file',
            file: null,
            searched: false
        }
    },

    handleFileDrop: function(e){
        this.props.imgSrchState.loading();
        fileName = e.target.value.split( '\\' ).pop();
        this.setState({ 
            labelValue : fileName + ' selected',
            searched: true
        });
        this.props.imgSrchState.fileSelected(e.target.files[0]);       
    },

    createNewItem: function( evt ) {

        AppDispatcher.dispatch({
            eventName: 'new-item',
        newItem: { name: 'Marco' } // example data
    });

    },

    makeSelectBoxClassName: function(){
        var searched = this.state.searched ? 'searched' : '';
        return 'select-box ' + searched;
    },


    render: function() {
        return <div className={this.makeSelectBoxClassName()}>
        <input  name='file' id='file' className='select-box--inputfile' onClick={this.createNewItem} />
        <label htmlFor='file'>{this.state.labelValue}</label>
        </div>;
    }

});