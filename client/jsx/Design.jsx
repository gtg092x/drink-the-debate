// Design component - design view of a board
Design = React.createClass({
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
    propTypes: {

    },

    componentDidMount(){
        this.subscription = Meteor.subscribe("board",this.props.params._id);
    },

    componentWillUnmount(){
        this.subscription.stop();
    },

    moveTo(phrase,newIndex) {
        Meteor.call("orderPhrase", this.props.board._id,phrase.slug,newIndex);
    },

    deleteThisBoard() {
        Meteor.call("deleteBoard", this.props.board._id,phrase.slug,newIndex);
    },

    handlePhrase(e){
        e.preventDefault();
        var drink = React.findDOMNode(this.refs.textDrink).value;
        var phrase = React.findDOMNode(this.refs.textPhrase).value;


        React.findDOMNode(this.refs.textPhrase).value = "";
        React.findDOMNode(this.refs.textDrink).value = "";

        Meteor.call('addPhrase',this.data.board._id,phrase,drink,1, (err,phrase)=>{

            if(err){
                console.log(err);
            }


        });


    },

    handleTitle(e){
        e.preventDefault();
        var board = React.findDOMNode(this.refs.textTitle).value;


        React.findDOMNode(this.refs.textTitle).value = "";

        Meteor.call('addBoard',board, (err,board_id)=>{
            var board = BoardsCollection.findOne(board_id);
            if(err){
                console.log(err);
            }

            if(!board.slug)
            {
                return "This name has already been taken";
            }
            React.findDOMNode(this.refs.textTitle).value = "";


            this.history.pushState(null, `/design/${board.slug}`, {});
        });


    },
    removeAt(slug){
        Meteor.call('removePhrase',this.data.board._id,slug, (err)=>{

        });
    },

    render() {
        // Give tasks a different className when they are checked off,
        // so that we can style them nicely in CSS
        var self = this;
        if(this.data.board){
            return (
                <div className='container'>
                    <h2 className="pull-right"><ReactRouter.Link className="btn btn-primary" to={'/host/'+this.data.board.slug}>Host <span className="fa fa-calendar"></span></ReactRouter.Link></h2>
                    <h1 className="">Editing <ReactRouter.Link to={'/board/'+this.data.board.slug}>{this.data.board.name}</ReactRouter.Link></h1>

                    <div className="clearfloat">
                    <ul className="list-unstyled">
                    {this.data.board.phrases.map(function (item,i) {
                        return (
                            <li key={item.slug}>{item.message} - <span className="drink">{item.drink}</span>
                                <DeleteButton onClick={self.removeAt.bind(this,item.slug)} />
                            </li>
                        );
                    })}
                    </ul>
                    </div>
                    <form className="new-board-phrase form-inline" onSubmit={this.handlePhrase} >
                        <fieldset class="form-group">
                        <input type="text" className="form-control" ref="textPhrase" placeholder="New Phrase Name" />
                        <input type="text" className="form-control" ref="textDrink" placeholder="What Drink?" />
                        <button type="submit" className="fa fa-plus-circle btn-link add-button">
                        </button>
                        </fieldset>
                    </form>
                </div>
            );
        }else{
            return (
                <div className='container'>
                    <form className="new-board-title  form-inline" onSubmit={this.handleTitle} >
                        <fieldset class="form-group">
                        <input type="text" ref="textTitle" className="form-control" placeholder="New Board Name" />
                            <button type="submit" className="fa fa-plus-circle btn-link add-button">
                            </button>
                        </fieldset>
                    </form>
                </div>
            );
        }


    }
});