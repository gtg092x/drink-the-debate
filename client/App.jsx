var Link = ReactRouter.Link;
// App component - represents the whole app
App = React.createClass({
  mixins: [ReactMeteorData],

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let query = {};

    if (this.state.hideCompleted) {
      // If hide completed is checked, filter tasks
      query = {checked: {$ne: true}};
    }

    return {
      boards: BoardsCollection.find(query, {sort: {createdAt: -1}}).fetch()
    };
  },

  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },

  renderTasks() {
    // Get tasks from this.data.tasks
    return this.data.tasks.map((task) => {
      const currentUserId = Meteor.userId();
      const showPrivateButton = task.owner === currentUserId;

      return(<Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton} />);
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call("addTask", text);

    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";
  },
  render() {

    var myBoards;
    if(Meteor.userId()){
      myBoards = <li className="nav-item"><Link to={'/my'}>My Boards</Link></li>;
    }

    return (
        <div>
          <header>
            <nav className="navbar navbar-light bg-faded">
              <div className="navbar-header container">
              <ul className="nav navbar-nav navbar-left">
                <li className="nav-item"><Link to={'/'}>Drink the Debate</Link></li>
              </ul>
              <ul className="nav navbar-nav navbar-right pull-right">
                {myBoards}
                <li className="nav-item"><AccountsUIWrapper /></li>
              </ul>
              </div>
            </nav>

          </header>
          <article className="app-main container">
            {this.props.children}
          </article>
          <footer className="container">
            <div className="pull-left"><a href='http://www.mediadrake.com' target='_blank'> &copy; Matthew Drake</a></div>
            <div className="pull-right"><a href='http://www.mediadrake.com' target='_blank'>Fork this Github <span className='fa fa-github'></span></a></div>
          </footer>
        </div>
    );
  }
});