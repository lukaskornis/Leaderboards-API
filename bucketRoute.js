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


module.exports = router;