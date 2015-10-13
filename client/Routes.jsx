const {
  Router,
  Route,
  IndexRoute,
  NotFoundRoute,
  Link,
  history
} = ReactRouter;

const browserHistory = history.createHistory()


Routes = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function () {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Index}/>
          <Route path="board/:id" component={Board} />
          <Route name="design" path="design/:id" component={Design} />
          <Route name="design_new" path="design" component={Design} />
          <Route path="host/:id" component={Host} />
          <Route path="my" component={MyBoards} />
          <Route path="*" component={NotFound}/>
        </Route>
      </Router>
    );
  }
});
