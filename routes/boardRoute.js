const express = require('express');
const router = express.Router();
const validateName = require('../middlewares/validateNameMiddleware');

const minNameLength = 3;
const maxNameLength = 10;

let boards = {};


// delete board
router.get('/:boardName/delete', (req, res) => {
    const board = boards[req.params.boardName];
    if (board) {
        boards[req.params.boardName] = {};
        res.send('Board deleted');
    } else {
        res.send('Board not found');
    }
});

// add value to already existing score
router.get('/:boardName/:name([a-z][a-z0-9_-]*)/:score(\\d+)/add', validateName, (req, res) => {
    const { boardName, name, score } = req.params;

    const board = boards[boardName] = boards[boardName] || {};
    const scoreInt = parseInt(score);


    // add if exists or set to score
    board[name] = board[name] ? board[name] + scoreInt : scoreInt;
    boards[boardName] = Object.fromEntries(Object.entries(board).sort(([, a], [, b]) => b - a));
    // send score as string
    res.send(board[name].toString());
});

// Add new score /boardName/name/score
router.get('/:boardName/:name([a-z][a-z0-9_-]*)/:score(\\d+)', validateName, (req, res) => {
    const { boardName, name, score } = req.params;

    const board = boards[boardName] = boards[boardName] || {};
    const scoreInt = parseInt(score);

    if (board[name] && board[name] >= scoreInt) {
        return res.status(400).json({ error: 'Score exists and is equal or higher' });
    }


    board[name] = scoreInt;
    boards[boardName] = Object.fromEntries(Object.entries(board).sort(([, a], [, b]) => b - a));
    res.json(board);
});


// route get top scores
router.get('/:boardName/:from(\\d+)-:to(\\d+)', (req, res) => {
    const { boardName, from, to } = req.params;
    console.log(req.params);
    if (!boards[boardName]) {
        return res.status(404).json({ error: 'Board not found' });
    }
    // as object
    const top = Object.fromEntries(Object.entries(boards[boardName]).slice(from, to));
    res.json(top);
});


// route get user position. board is already sorted
router.get('/:boardName/:name/position', (req, res) => {
    const { boardName, name } = req.params;
    if (!boards[boardName]) {
        return res.status(404).json({ error: 'Cannot get user position. Board not found' });
    }

    if (!boards[boardName][name]) {
        return res.status(404).json({ error: 'Cannot get user position. Name not found' });
    }

    const position = Object.entries(boards[boardName]).findIndex(([key]) => key === name);
    res.send(position.toString());
});

// Delete score /boardName/name/delete
router.get('/:boardName/:name/delete', (req, res) => {
    const board = boards[req.params.boardName];
    if (!board) {
        return res.status(404).json({ error: 'Cannot delete. Board not found' });
    }

    delete board[req.params.name];
    res.json(board);
});


// route get user score. board is already sorted
router.get('/:boardName/:name', (req, res) => {
    const { boardName, name } = req.params;
    if (!boards[boardName]) {
        return res.status(404).json({ error: 'Cannot get user. Board not found' });
    }

    if (!boards[boardName][name]) {
        return res.status(404).json({ error: 'Cannot get user. Name not found' });
    }

    console.log(boards[boardName][name]);
    res.send(boards[boardName][name].toString());
});




// get board
router.get('/:boardName', (req, res) => {
    const board = boards[req.params.boardName] || 'Cannot get board. Board not found';
    res.send(board);
});

// get all board names
router.get('/', (req, res) => {
    console.log(req.originalUrl);
    // send as array of value names
    res.send(Object.keys(boards));
});


// Saving/Loading boards to/from file
const fs = require('fs');
const { log } = require('console');
const saveFile = 'data/boards.json';

const saveData = (data) => {
    try {
        fs.writeFileSync(saveFile, JSON.stringify(data));
        console.log('Data saved!');
    } catch (err) {
        console.error(err);
    }
};

const loadData = () => {
    try {
        const data = fs.readFileSync(saveFile);
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return {};
    }
};

boards = loadData();

// save boards to file every 30 seconds
setInterval(() => saveData(boards), 1000 * 60);

// save boards to file on exit
process.on('SIGINT', () => {
    saveData(boards);
    process.exit();
});

module.exports = {
    router,
    boards
}