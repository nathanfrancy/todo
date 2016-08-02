var vm = new Vue({
    el: '#todos-wrapper',
    data: {
        text: '',
        todos: []
    },
    methods: {
        getTodos: function() {
            var that = this;
            $.ajax({
                url: "/api/todos",
                type: "get",
                dataType: "json",
                success: function(data) {
                    that.todos = data;
                }
            });
        },
        createTodo: function() {
            var that = this;
            if (this.text) {
                $.ajax({
                    url: "/api/todos",
                    type: "post",
                    dataType: "json",
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({
                        text: that.text
                    }),
                    success: function(data) {
                        console.log(data);
                        that.text = '';
                    }
                });
            }
        }
    }
});

vm.getTodos();