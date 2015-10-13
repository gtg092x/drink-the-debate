// Board component - public view of a board
Board = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function() {
        const currentUserId = Meteor.userId();
        let { id } = this.props.params;

        var board = BoardsCollection.findOne({slug:id});
        if(!board)
        return {board:null};
        board.is_owned = board.owner == currentUserId;
        return {
            board: board
        };
    },
    propTypes: {
        board: React.PropTypes.object.isRequired
    },

    componentDidMount(){
        let { id } = this.props.params;
        this.subscription = Meteor.subscribe("board",id);
    },

    componentWillUnmount(){
        this.subscription.stop();
    },

    render() {
        if(!this.data.board){
            return <Loading />
        }
        var history = this.data.board.phrases.reduce(function(cursor,el){
            return cursor.concat(el.shots.map(function(shot){
                return {message:el.message,drink:el.drink,createdAt:shot.createdAt};
            }));
        },[]);

        var HostThis = <span />;
        if(this.data.board.owner == Meteor.userId()){
            HostThis = (<h2><ReactRouter.Link to={'/host/'+this.data.board.slug}>Host</ReactRouter.Link></h2>);
        }

        return (
            <div className='board'>
                <h1>{this.data.board.name}</h1>
                {HostThis}
                <div className="phrases col-xs-8">
                    <ul>
                    {this.data.board.phrases.map(function (item,i) {
                        return (
                            <li key={item.slug}>
                                <span className="phrase">{item.message}</span>
                                <span className="drink">{item.drink}</span>
                                <span className="count">{item.shots.length}</span>
                            </li>
                        );
                    })}
                    </ul>
                </div>
                <div className="shots col-xs-4">
                    <ul>
                    {history.map(function(item){
                        return <li key={item.slug+item.createdAt.getTime().toString()}>{item.message} <span className="drink">{item.drink}</span><time>{item.createdAt.toString()}</time></li>;
                    })}
                    </ul>
                </div>
            </div>
        );
    }
});