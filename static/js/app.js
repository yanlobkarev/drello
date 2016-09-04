var APIMixin = {
    componentWillMount: function () {
        this.api = new APIClient();
        this.api.subscribe(this);
    }
};

//  Solution for React contentEditable taken from 
//  http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
var ContentEditable = React.createClass({ 
    render: function(){
        return <h3 
            onInput={this.emitChange} 
            onBlur={this.emitChange}
            contentEditable
            dangerouslySetInnerHTML={{__html: this.props.html}}></h3>;
    },
    shouldComponentUpdate: function(nextProps){
        return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
    },
    emitChange: function(){
        var html = ReactDOM.findDOMNode(this).innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    }
});

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
        this.api.deleteTask(this.state.pk);
    },
    _onChange: function (data) {
        var self = this;

        //  Relaxing api calls intensity
        //  (gonna be called after second
        //  when user stopped typing)
        clearTimeout(this.delayedUpdate);
        this.delayedUpdate = setTimeout(function () {
            self.api.updateTask({
                pk: self.state.pk,
                title: data.target.value,
            });
        }, 1000);
    },
    onmessage: function (data) {
        if (data.pk !== this.state.pk) {
            return;
        }

        this.setState(data);
    },
    render: function () {
        return <div className='task' id={this.state.pk}>
                    <p onClick={this._onDeleteTask}>X</p>
                    <ContentEditable 
                        html={this.state.title}
                        onChange={this._onChange} 
                        ref='input' />
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



