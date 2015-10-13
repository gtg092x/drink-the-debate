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

        var allShots = board.phrases.reduce(function(cur,el){
            return cur.concat(el.shots);
        },[]);

        if(this.shotsLength !== undefined && this.shotsLength != allShots.length){
            this.playSound();
        }

        this.shotsLength = allShots.length;
        return {
            board: board
        };
    },
    animateNewShot(oldShots,newShots){

    },
    playSound(){
        clearTimeout(this.soundTo);
        var self = this;
        this.soundTo = setTimeout(function(){
            self.shotSound.play();
        },500);
        //shotSound.addEventListener('canplaythrough', function() {

        //});
    },
    propTypes: {
        board: React.PropTypes.object.isRequired
    },

    componentDidMount(){
        this.shotSound = new Audio('/disk.wav');
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
            HostThis = (<ReactRouter.Link className="btn btn-primary" to={'/host/'+this.data.board.slug}>Host <span className="fa fa-calendar"></span></ReactRouter.Link>);
        }

        var cards;

        if(this.data.board.phrases.length){
            cards = (<ul className='list-unstyled'>
                {this.data.board.phrases.map(function (item,i) {
                    return (
                        <li key={item.slug} className='col-md-6 col-lg-4 col-xs-6'>
                            <div className='card'>
                                <div className="phrase card-header">

                                    <h3 className='card-title'>{item.message}</h3>
                                </div>
                                <div className="drink card-block">
                                    <span className='pull-right badge'>{item.shots.length}</span>
                                    <p className='card-text'>{item.drink}</p>
                                </div>

                            </div>
                        </li>
                    );
                })}
            </ul>);
        }else{
            cards = <div><hr /><h3>Oops! Looks like this board doesn't have any phrases yet.</h3><p> If you own this board, you should edit it.</p></div>;
        }
        var editThis;
        if(this.data.board.owner == Meteor.userId()){
            editThis = (<h2 className="pull-right">{HostThis} <ReactRouter.Link className="btn btn-success" to={'/design/'+this.data.board.slug}>Edit <span className="fa fa-pencil"></span></ReactRouter.Link></h2>);
        }

        return (
            <div className='board'>
                <div className='clearfix'>
                {editThis}
                <h1>{this.data.board.name} </h1>

                <div className="phrases col-md-8 col-xs-12">
                    {cards}
                </div>
                </div>
                <hr />
                <div className="shots col-md-12 col-xs-12">
                    <ul className='list-unstyled history'>
                    {history.map(function(item){
                        return (
                            <li key={item.slug+item.createdAt.getTime().toString()}>

                                <p><time>{moment(item.createdAt).fromNow()}</time> "{item.message}" <br /> {item.drink}</p>


                            </li>
                        );
                    })}
                    </ul>
                </div>
            </div>
        );
    }
});