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
    );
  }
});
