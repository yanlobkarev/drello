var APIMixin = {
    componentWillMount: function () {
        this.api = new APIClient();
        this.api.subscribe(this);
    }
};

var Task = React.createClass({
    mixins: [APIMixin],
    propTypes: {
        description: React.PropTypes.string, 
        title: React.PropTypes.string,
        pk: React.PropTypes.number,        
    },
    getInitialState: function () {        
        return this.props;
    },
    _onDeleteTask: function () {
        var self = this;
        this.api.deleteTask(this.state.pk, this._onTaskDeletedCb);
    },
    _onTaskDeletedCb: function (data) {
        //  pass
    },
    render: function () {
        return  <div className='task' id={this.state.pk}>
                    <p onClick={this._onDeleteTask}>X</p>
                    <h3>{this.state.title}</h3>
                </div>
    }
});


var Status = React.createClass({
    mixins: [APIMixin],
    propTypes: {
        title: React.PropTypes.string,
        pk: React.PropTypes.number,
    },  
    getInitialState: function () {        
        return this.props;
    },
    _onAddTask: function () {
        var self = this;
        this.api.createTaskWithStatus(self.state.pk, this._onTaskAddedCb); 
    },
    _onTaskAddedCb: function (data) {
        //  pass
    },
    onmessage: function (data) {
        if (data.status !== this.state.pk) {
            return;
        }

        var tasks = this.state.tasks;
        var i = _.findIndex(tasks, {pk: data.pk});
        if (data.action === 'created') {
            tasks.push(data);
        } else if (data.action === 'deleted') {
            tasks.splice(i, 1);
        }
        this.setState(this.state);
    },
    render: function () {
        var tasks = _.map(this.state.tasks, function (task) {
            task.key = task.pk;
            return React.createElement(Task, task);
        });
        return  <div className='status' id={this.state.pk}>
                    <div className='status-bar'>
                        <h2>{this.state.title}</h2>
                        <p onClick={this._onAddTask}>+</p>
                    </div>
                    {tasks}
                </div>
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
        return <div><h1>Drello Board</h1><div className='board'>{statuses}</div></div>
    }
});


ReactDOM.render(
    React.createElement(Board),
    document.getElementById("app")
);



