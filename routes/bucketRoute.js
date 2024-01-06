const express = require('express');
const router = express.Router();

const buckets = {}

// view all buckets
router.get('/', (req, res) => {
    res.send(buckets[req.params.boardName]);
});

// view buckets for board
router.get('/:boardName', (req, res) => {
    if (buckets[req.params.boardName]) {
        res.send(buckets[req.params.boardName]);
    } else {
        res.send('Bucket board not found');
    }
});


// add to buckets
router.get('/:boardName/:bucket(\\d+)', (req, res) => {
    // if board does not exist, create it
    if (!buckets[req.params.boardName]) {
        buckets[req.params.boardName] = {};
    }

    // if bucket does not exist, create it
    if (!buckets[req.params.boardName][req.params.bucket]) {
        buckets[req.params.boardName][req.params.bucket] = 0;
        // sort it by key
        buckets[req.params.boardName] = Object.keys(buckets[req.params.boardName]).sort().reduce((r, k) => (r[k] = buckets[req.params.boardName][k], r), {});
    }

    // increment bucket
    buckets[req.params.boardName][req.params.bucket]++;

    res.send('Bucket incremented');
});


// SAVING LOADING
const fs = require('fs');
const saveFile = 'data/buckets.json';

function saveBuckets() {
    fs.writeFile(saveFile, JSON.stringify(buckets), function (err) {
        if (err) throw err;
        console.log('Saved Buckets!');
    });
}

function loadBuckets() {
    fs.readFile(saveFile, function (err, data) {
        if (err) throw err;
        Object.assign(buckets, JSON.parse(data));
    });
}

// load buckets from file on startup
loadBuckets();

// save buckets to file every 30 seconds
setInterval(() => { saveBuckets(); }, 1000 * 30);
// save buckets to file on exit
process.on('SIGINT', function () {
    saveBuckets();
    process.exit();
});


module.exports = router;