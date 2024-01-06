const fs = require('fs');

const express = require('express');
const router = express.Router();

const minNameLength = 3;
const maxNameLength = 10;

const boards = {}


// get all boards only names
router.get('/', (req, res) => {
    res.send(Object.keys(boards));
});


router.get('/:boardName', (req, res) => {
    if (boards[req.params.boardName]) {
        // send format: name,score|name,score|name,score
        res.send(Object.entries(boards[req.params.boardName]).map(x => x.join('|')).join(','));
    } else {
        res.send('Board not found');
    }
});

// reset board
router.get('/:boardName/reset', (req, res) => {
    if (boards[req.params.boardName]) {
        boards[req.params.boardName] = {};
        res.send('Board reset');
    } else {
        res.send('Board not found');
    }
});



// Add new score /boardName/name/score
router.get('/:boardName/:name([a-zA-Z][a-zA-Z0-9_-]*)/:score(\\d+)', (req, res) => {
    if (req.params.name.length < minNameLength || req.params.name.length > maxNameLength) {
        res.send('Name length must be between ' + minNameLength + ' and ' + maxNameLength);
        return;
    }

    boards[req.params.boardName] = boards[req.params.boardName] || {};
    var score = parseInt(req.params.score);

    // if score exists and is lower than new score, return
    if (boards[req.params.boardName][req.params.name] && boards[req.params.boardName][req.params.name] >= score) {
        res.send('Score exists and is equal or higher');
        return;
    }

    boards[req.params.boardName][req.params.name] = score;
    // sort scores
    boards[req.params.boardName] = Object.fromEntries(Object.entries(boards[req.params.boardName]).sort(([, a], [, b]) => b - a));

    res.json(boards[req.params.boardName]);
});


// Delete score /boardName/name/delete
router.get('/:boardName/:name/delete', (req, res) => {
    if (boards[req.params.boardName]) {
        delete boards[req.params.boardName][req.params.name];
        res.send(boards[req.params.boardName]);
    } else {
        res.send('Not found');
    }
});

// route get top scores
router.get('/:boardName/:from(\\d+)-:to(\\d+)', (req, res) => {
    if (boards[req.params.boardName]) {
        var board = boards[req.params.boardName];
        var from = parseInt(req.params.from);
        var to = parseInt(req.params.to);
        var top = Object.entries(board).slice(from, to);

        // send format: name,score|name,score|name,score
        res.send(top.map(x => x.join('|')).join(','));
    } else {
        res.send('Board not found');
    }
});


// route get user score and position. board is already sorted
router.get('/:boardName/:name', (req, res) => {
    if (boards[req.params.boardName]) {
        var board = boards[req.params.boardName];
        var name = req.params.name;
        if (board[name]) {
            var position = Object.keys(board).indexOf(name);
            res.send({ score: board[name], position: position, total: Object.keys(board).length });
        } else {
            res.send('Name not found');
        }
    } else {
        res.send('Board not found');
    }
});


// Saving/Loading boards to/from file
function saveBoards() {
    fs.writeFile('data/boards.json', JSON.stringify(boards), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

// save to file every X minutes
setInterval(() => { saveBoards(); }, 1000 * 30);

// save to file on exit
process.on('SIGINT', function () {
    saveBoards();
    process.exit();
});

// load boards from file
fs.readFile('data/boards.json', (err, data) => {
    if (err) throw err;
    Object.assign(boards, JSON.parse(data));
});

module.exports = router;