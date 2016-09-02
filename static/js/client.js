(function (exports) {
    exports.APIClient = function () {
        var self = this;
        var eb = function (a, b) {
            console.log('error=', a, b);
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












