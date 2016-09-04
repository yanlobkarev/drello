var APIMixin = {
    componentWillMount: function () {
        this.api = new APIClient();
        this.api.subscribe(this);
    },
    componentWillUnmount: function () {
        this.api.unsubscribe(this);
    },
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
    _onDragStart: function (e) {
        e.dataTransfer.setData('text', JSON.stringify(this.state));
    },
    render: function () {
        return <div className='task' id={this.state.pk}
                    draggable='true' onDragStart={this._onDragStart}>
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
        this.api.createTaskWithStatus(self.state.pk); 
    },
    onmessage: function (data) {
        if (data.action === 'updated') {
            var tasksPks = _.pluck(this.state.tasks, 'pk');
            var wasInTasks = _.contains(tasksPks, data.pk);
            var nowInTasks = data.status === this.state.pk;

            if (!wasInTasks && nowInTasks) {            //  moved in
                this.state.tasks.push(data);
                this.setState(this.state);
            } else if (wasInTasks && !nowInTasks) {     //  moved out
                var i = _.findIndex(this.state.tasks, {pk: data.pk});
                this.state.tasks.splice(i, 1);
                this.setState(this.state);
            }
        } else if (data.status === this.state.pk) {
            var tasks = this.state.tasks;        
            if (data.action === 'created') {            //  added
                tasks.push(data);
            } else if (data.action === 'deleted') {     //  deleted
                var i = _.findIndex(tasks, {pk: data.pk});
                tasks.splice(i, 1);
            }
            this.setState(this.state);
        }
    },
    _onDragOver: function (e) {
        e.preventDefault()
    },
    _onDrop: function (e) {
        e.preventDefault();

        var self = this;
        var task = JSON.parse(e.dataTransfer.getData('text'));
        this.api.updateTask({
            pk: task.pk,
            status: self.state.pk,
        });

        //  Manually moving model from one status to another
        //  to boost UI interaction (cuz waiting websocket
        //  update kinda longer).
        var oldStatus = window.board.refs['status'+task.status];
        var i = _.findIndex(oldStatus.state.tasks, {pk: task.pk})
        oldStatus.state.tasks.splice(i, 1)
        oldStatus.setState(oldStatus.state)
        
        task.status = this.state.pk;
        this.state.tasks.push(task);
        this.setState(this.state);
    },
    render: function () {
        var tasks = _.map(this.state.tasks, function (task) {
            return React.createElement(Task, _.extend(task, {
                stateElement: this,
                key: task.pk,
            }));
        });
        return  <div className='status' id={this.state.pk} 
                     onDrop={this._onDrop} onDragOver={this._onDragOver}>
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
            return React.createElement(Status, _.extend(s, {
                ref: 'status'+s.pk, //  to access globally via `window.board.status1`
                key: s.pk,          //  to reduce React.js warnings
            }));
        }); 
        return <div><h1>Drello Board</h1><div className='board'>{statuses}</div></div>
    }
});

window.board = ReactDOM.render(React.createElement(Board), $("#app")[0]);


