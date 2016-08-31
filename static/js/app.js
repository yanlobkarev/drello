var Task = React.createClass({
    propTypes: {
        description: React.PropTypes.string, 
        title: React.PropTypes.string,
        pk: React.PropTypes.number,        
    },
    getInitialState: function () {        
        return this.props;
    },
    render: function () {
        return <div className='task' id={this.state.pk}><h3>{this.state.title}</h3></div>
    }
});


var Status = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        pk: React.PropTypes.number,
    },  
    getInitialState: function () {        
        return this.props;
    },
    render: function () {
        var tasks = _.map(this.state.tasks, function (task) {
            task.key = task.pk;
            return React.createElement(Task, task);
        });
        return <div className='status' id={this.state.pk}><h2>{this.state.title}</h2>{tasks}</div>
    }
});


var Board = React.createClass({
    getInitialState: function () {
        return { statuses: [] };
    },
    componentDidMount: function () {
        var self = this;
        $.ajax({
            url: '/api/statuses.json',
            dataType: 'json',
            success: self._onBoardDidLoad,
            error: self._onError,
        });
    },
    _onBoardDidLoad: function (data) {
        this.setState({
            statuses: data
        });
    },
    _onError: function (xhr, responseStatus) {
        console.log('error:', responseStatus);
    }, 
    render: function () {
        var statuses = _.map(this.state.statuses, function (s) {
            s.key = s.pk;   //  to reduce React.js warnings
            return React.createElement(Status, s);
        });
        console.log('statuses=', statuses); 
        return <div className='board'><h1>Drello Board</h1>{statuses}</div>
    }
});


ReactDOM.render(
    React.createElement(Board),
    document.getElementById("app")
);


