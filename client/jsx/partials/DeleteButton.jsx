DeleteButton = React.createClass({
    render(){
        return <button type="button" className={"delete-button btn btn-link "+ this.props.className} onClick={this.props.onClick}><span className="delete-icon fa fa-minus-circle"></span></button>
    }
})