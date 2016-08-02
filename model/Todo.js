let uuid = require('node-uuid');

class Todo {

    constructor(id = null, title = null, lastUpdated = new Date(), created = new Date()) {
        if (id === null)
            this.id = uuid.v4();
        else this.id = id;

        this.title = title;
        this.lastUpdated = lastUpdated;
        this.created = created;
    }

}

module.exports = Todo;