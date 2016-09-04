(function (exports) {
    var subscribers = [];
    var socket = new WebSocket("ws://" + window.location.host + "/subscribers/");

    socket.onmessage = function(e) {
        data = JSON.parse(e.data);
        console.log('ws event=', data);
        _.each(subscribers, function (s) {
            if (s.onmessage) {
                s.onmessage(data);
            }
        });
    }
    
    exports.APIClient = function () {
        var self = this;
        var eb = function (a, b) {
            console.log('error=', a, b);
        };

        this.subscribe = function (obj) {
            subscribers.push(obj);
        };
        this.createTaskWithStatus = function (statusPk, cb) {
            $.post({
                url: '/api/tasks/',
                data: {
                    title: '',
                    description: '',
                    status: statusPk,
                },
                dataType: 'json',
                success: cb,
                error: eb,
                cache: false,
            });
        };
        this.updateTask = function (data, cb) {
            $.post({
                url: '/api/tasks/'+data.pk+'/',
                type: 'PUT',
                data: data,
                dataType: 'json',
                success: cb,
                error: eb,
                cache: false,
            });
        };
        this.deleteTask = function (pk, cb) {
            $.ajax({ 
                type: 'DELETE',
                url: '/api/tasks/'+pk,
                dataType: 'json',
                success: cb,
                error: eb,
                cache: false,
            });
        }
    };
})(window); 


