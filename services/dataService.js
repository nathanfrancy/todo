let comb = require('comb');
// TODO: add to RollingFileAppender for production.
let logger = comb.logger('services.data').addAppender('ConsoleAppender');

let uuid = require('node-uuid');
let csv = require('fast-csv');
let fs = require('fs');

let headers = ["id", "text", "created"];
let dataFile = "temp/data.csv";
var dir = 'temp';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

class DataService {

    static readTodos() {
        logger.info("Reading todos...");
        return new Promise((resolve, reject) => {
            let todos = [];

            let stream = fs.createReadStream(dataFile);
            let csvStream = csv.fromStream(stream, {headers : headers});

            csvStream.on("data", (data) => {
                todos.push(data);
            });

            csvStream.on("error", (err) => {
                logger.error(err.message);
                reject(err);
            });

            csvStream.on("end", () => {
                logger.info(`Read ${todos.length} todos.`);
                resolve(todos);
            });
        });

    }

    static writeNewTodo(todo) {
        logger.info(`Writing todo: "${todo.text}"`);
        if (!todo.id) todo.id = uuid.v4();

        let that = this;
        return new Promise((resolve, reject) => {
            that.readTodos().then((todos) => {
                todos.push(todo);
                that.writeTodos(todos);
                resolve(todo);
            }).catch((err) => {
                logger.error(err.message);
                reject(err);
            });
        });
    }

    static writeTodos(todos) {
        return new Promise((resolve, reject) => {
            let writeAction = csv.writeToPath(dataFile, todos, { headers: false });

            writeAction.on("error", (err) => {
                reject(err);
            });

            writeAction.on("finish", () => {
                resolve();
            });
        });
    }

    static findById(id) {
        let that = this;
        return new Promise((resolve, reject) => {
            if (!id) reject(new Error("Must include id value."));
            else {
                that.readTodos().then((todos) => {
                    for (let i = 0; i < todos.length; i++) {
                        if (todos[i].id === id) {
                            resolve(todos[i]);
                            return;
                        }
                    }

                    let err = new Error("No todo associated with that ID.");
                    err.code = "ERR_NO_TODO_FOUND";
                    logger.error(err.message);
                    reject(err);
                }).catch((err) => {
                    logger.error(err.message);
                    reject(err);
                });
            }
        });
    }

    static updateTodo(todo) {
        let that = this;
        return new Promise((resolve, reject) => {
            if (!id) reject(new Error("Must include id value."));
            else {
                that.readTodos().then((todos) => {
                    var i = todos.length;
                    while (i--) {
                        if (todos[i].id === todo.id) {
                            todos[i] = todo;
                            resolve(that.writeTodos(todos));
                            return;
                        }
                    }

                    let err = new Error("No todo associated with that ID.");
                    err.code = "ERR_NO_TODO_FOUND";
                    logger.error(err.message);
                    reject(err);
                }).catch((err) => {
                    logger.error(err.message);
                    reject(err);
                });
            }
        });
    }

    static deleteById(id) {
        let that = this;
        return new Promise((resolve, reject) => {
            if (!id) reject(new Error("Must include id value."));
            else {
                that.readTodos().then((todos) => {
                    var i = todos.length;
                    while (i--) {
                        if (todos[i].id === id) {
                            todos.splice(i, 1);
                            resolve(that.writeTodos(todos));
                            return;
                        }
                    }

                    let err = new Error("No todo associated with that ID.");
                    err.code = "ERR_NO_TODO_FOUND";
                    logger.error(err.message);
                    reject(err);
                }).catch((err) => {
                    logger.error(err.message);
                    reject(err);
                });
            }
        });
    }

}

module.exports = DataService;