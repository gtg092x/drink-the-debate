var Link = ReactRouter.Link;

Index = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData: function() {
    return {
      boards: BoardsCollection.find({}).fetch() || []
    };
  },
  getInitialState: function() {
    return {};
  },
  render: function () {
    return (
        <div>
          <h1>Drink the Debate</h1>
          <div className="card card-block">
            <p className='card-text'>Welcome to drink the debate! Below you will see boards that you can watch as you follow along with presidential debates. Every board has its own unique phrases that light up when a politician repeats them.<br /><br /> Try not to die!</p>
          </div>
          <ul className="boards-index list-unstyled">
            {this.data.boards.map(function (item) {
              return (
                  <li key={item._id} className="col-xs-4 debate-card">
                    <ReactRouter.Link className="card" to={'/board/'+item.slug}>
                      <span className="card-header">
                        <span className="card-title">{item.name}</span>
                      </span>
                      <span className="card-block">
                        <span className="card-text">{item.user.emails[0]}</span>
                      </span>
                    </ReactRouter.Link>
                  </li>);
            })}
          </ul>
        </div>
    );
  }
});
