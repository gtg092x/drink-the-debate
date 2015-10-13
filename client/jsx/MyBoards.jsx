MyBoards = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function() {
        const currentUserId = Meteor.userId();
        return {
            boards: BoardsCollection.find({owner:currentUserId}).fetch() || []
        };
    },
    propTypes: {
        boards: React.PropTypes.array.isRequired
    },
    componentWillUnmount(){
        this.subscription.stop();
    },
    componentDidMount(){
        this.subscription = Meteor.subscribe("myBoards");
    },
    removeAt(id){
        Meteor.call('removeBoard',id, (err)=>{

        });
    },
    render(){
        var self = this;

        if(!this.data.boards){
            return <Loading />;
        }

        return (
            <div className="my-boards-wrapper">
                <div className="pull-right col-sm-3 col-xs-12">
                    <ReactRouter.Link to={'/design'} className="fa fa-plus-circle btn-link add-button">
                        <span className='note'>New Board</span>
                    </ReactRouter.Link>
                </div>
                <ul className="my-boards col-xs-12 col-sm-9 list-unstyled">
                    {this.data.boards.map(function (item) {
                        return (
                            <li key={item._id} className="col-xs-6 my-board-card">
                                <div className='card'>
                                    <div className='card-block'>
                                        <ReactRouter.Link className='card-text btn btn-primary' to={'/board/'+item.slug}>{item.name}</ReactRouter.Link>
                                        <DeleteButton className='pull-right' onClick={self.removeAt.bind(this,item._id)}></DeleteButton>
                                        <ReactRouter.Link className='card-text' to={'/host/'+item.slug}>Host</ReactRouter.Link>
                                        <ReactRouter.Link className='card-text' to={'/design/'+item.slug}>Edit</ReactRouter.Link>
                                    </div>

                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
});