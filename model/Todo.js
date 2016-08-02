let uuid = require('node-uuid');

class Todo {

    constructor(id = null, title = null, created = new Date()) {
        if (id === null)
            this.id = uuid.v4();
        else this.id = id;

        this.title = title;
        this.created = created;
    }

}

module.exports = Todo;