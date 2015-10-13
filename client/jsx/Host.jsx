// Task component - represents a single todo item
Host = React.createClass({
    propTypes: {
        board: React.PropTypes.object.isRequired
    },
    mixins: [ReactMeteorData,ReactRouter.History],
    getMeteorData: function() {
        let { id } = this.props.params;

        if(!id){
            return {
                board:null
            }
        }

        return {
            board: BoardsCollection.findOne({slug:id})
        };
    },

    componentDidMount(){
        if(this.data.board)
        this.subscription = Meteor.subscribe("board",this.data.board._id);
    },

    componentWillUnmount(){
        if(this.subscription)
        this.subscription.stop();
    },

    addShot(slug) {
        // Set the checked property to the opposite of its current value
        Meteor.call("addShot", this.data.board._id, slug);
    },

    removeShot(slug) {
        // Set the checked property to the opposite of its current value
        Meteor.call("removeShot",this.data.board._id,  slug);
    },


    render() {
        var self = this;
        var editThis;

        if(!this.data.board){
            return <Loading />;
        }

        if(this.data.board.owner == Meteor.userId()){
            editThis = (<h2 className="pull-right"><ReactRouter.Link className="btn btn-success" to={'/design/'+this.data.board.slug}>Edit <span className="fa fa-pencil"></span></ReactRouter.Link></h2>);
        }

        return (
            <div className="hosting">
                {editThis}
                <h1>Hosting {this.data.board.name}</h1>
                <div className="card card-block">
                <p className='card-text'>When a candidate says one of your phrases, press the button!</p>
                </div>
                <ul className="host-shooters  list-unstyled">
                    {this.data.board.phrases.map(function (item,i) {
                        return <li key={item.slug} className="btnsqr col-xs-4">
                            <div className="card">
                            <div className="card-header">
                            <button className="btn btn-primary" type="button" onClick={self.addShot.bind(this,item.slug)}>{item.message} - <span className="drink">{item.drink}</span></button>
                            <DeleteButton onClick={self.removeShot.bind(this,item.slug)} />
                            </div>
                            <ul className="history list-unstyled card-block">
                                {item.shots.map(function (shot,i) {
                                    return <li key={item.slug+i} className="card-text">{moment(shot.createdAt).fromNow()}</li>;
                                })}
                            </ul>
                            </div>
                        </li>;
                    })}
                </ul>
            </div>
        );
    }
});