var express = require('express');
var router = express.Router();
var mw = require('./middleware');

let uuid = require('node-uuid');
let comb = require('comb');
let logger = comb.logger('routes.api').addAppender('ConsoleAppender');

let services = require('./../services');
let DataService = services.data;

/**
 * Gets all todos
 */
router.get('/todos', mw.logging.location, (req, res, next) => {
    DataService.readTodos().then((todos) => {
        res.json(todos);
    }).catch((err) => {
        logger.error(err.message);
        res.status(500).json({
            error: err.message
        });
    });
});

/**
 * Gets single todo by Id value.
 */
router.get('/todos/:id', mw.logging.location, (req, res, next) => {
    DataService.findById(req.params.id).then((todo) => {
        res.json(todo);
    }).catch((err) => {
        logger.error(err.message);
        res.status(500).json({
            error: err.message
        });
    });
});

/**
 * Creates a new todo item
 */
router.post('/todos', mw.logging.location, (req, res, next) => {
    DataService.writeNewTodo({
        id: uuid.v4(),
        text: req.body.text,
        created: new Date()
    }).then((todo) => {
        res.status(200).json(todo);
    }).catch((err) => {
        logger.error(err.message);
        res.status(500).json({
            error: err.message
        });
    });
});

/**
 *  Updates an existing todo item
 */
router.put('/todos', mw.logging.location, (req, res, next) => {
    DataService.updateTodo(req.body).then(() => {
        res.status(200).send();
    }).catch((err) => {
        logger.error(err.message);
        res.status(500).json({
            error: err.message
        });
    });
});

/**
 * Deletes a todo item based on ID
 */
router.delete('/todos/:id', mw.logging.location, (req, res, next) => {
    DataService.deleteById(req.params.id).then(() => {
        res.status(200).send();
    }).catch((err) => {
        logger.error(err.message);
        res.status(500).json({
            error: err.message
        });
    });
});

module.exports = router;