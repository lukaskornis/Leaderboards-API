const minNameLength = 3;
const maxNameLength = 10;


const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const bucketRoute = require('./bucketRoute');
const boardRoute = require('./boardRoute');

const app = express();
const port = process.env.PORT || 80;

const boards = {}

const limiter = rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 20 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const toLowerCaseMiddleware = (req, res, next) => {
    req.url = req.url.toLowerCase();
    next();
};
app.use(toLowerCaseMiddleware);

app.get('/', (req, res) => {
    res.send('SimVik Leaderboard API!');
});

app.use("/", boardRoute);
app.use("/buckets", bucketRoute);

// load boards from file
fs.readFile('boards.json', (err, data) => {
    if (err) throw err;
    Object.assign(boards, JSON.parse(data));
});

// get all boards only names
app.get('/boards', (req, res) => {
    res.send(Object.keys(boards));
});

// add to buckets


app.get('/:boardName', (req, res) => {
    if (boards[req.params.boardName]) {
        // send format: name,score|name,score|name,score
        res.send(Object.entries(boards[req.params.boardName]).map(x => x.join('|')).join(','));
    } else {
        res.send('Board not found');
    }
});

// reset board
app.get('/:boardName/reset', (req, res) => {
    if (boards[req.params.boardName]) {
        boards[req.params.boardName] = {};
        res.send('Board reset');
    } else {
        res.send('Board not found');
    }
});



// Add new score /boardName/name/score
app.get('/:boardName/:name([a-zA-Z][a-zA-Z0-9_-]*)/:score(\\d+)', (req, res) => {
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
app.get('/:boardName/:name/delete', (req, res) => {
    if (boards[req.params.boardName]) {
        delete boards[req.params.boardName][req.params.name];
        res.send(boards[req.params.boardName]);
    } else {
        res.send('Not found');
    }
});



// route get top scores
app.get('/:boardName/:from(\\d+)-:to(\\d+)', (req, res) => {
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
app.get('/:boardName/:name', (req, res) => {
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



// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

// undefined routes
app.use(function (req, res, next) {
    res.status(404).send('?');
});

app.listen(port, () => {
    console.log(`listening at ${port} port`)
});


// save to file every X minutes
// save to file on exit
function saveBoards() {
    fs.writeFile('boards.json', JSON.stringify(boards), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

setInterval(() => { saveBoards(); }, 1000 * 30);
process.on('SIGINT', function () {
    saveBoards();
    process.exit();
}); 