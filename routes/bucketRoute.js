const express = require('express');
const router = express.Router();

const buckets = {}



// delete bucket board if exists
router.get('/:boardName/delete', (req, res) => {
    const { boardName } = req.params;

    // if board does not exist, return an error message
    if (!buckets[boardName]) {
        return res.status(404).json({ error: 'Cannot delete. Board not found' });
    }

    delete buckets[boardName];
    res.json(buckets);
});


// add to buckets
router.get('/:boardName/:bucket(\\d+)', (req, res) => {
    const { boardName, bucket } = req.params;

    // if board does not exist, create it
    buckets[boardName] = buckets[boardName] || {};

    // if bucket does not exist, create it and set its value to 0
    buckets[boardName][bucket] = buckets[boardName][bucket] || 0;

    // increment bucket
    buckets[boardName][bucket]++;

    res.send('Bucket incremented');
});


// view buckets for board
router.get('/:boardName([a-z][a-z0-9_-]*)', (req, res) => {
    const { boardName } = req.params;

    // if board does not exist, return an error message
    const board = buckets[boardName] || 'Bucket board not found';

    res.send(board);
});


// view all buckets names
router.get('/', (req, res) => {
    res.send(Object.keys(buckets));
});


// SAVING LOADING
const fs = require('fs');
const saveFile = 'data/buckets.json';


const saveBuckets = () => {
    try {
        fs.writeFileSync(saveFile, JSON.stringify(buckets));
        console.log('Saved Buckets!');
    } catch (err) {
        console.error(err);
    }
};


const loadBuckets = () => {
    try {
        const data = fs.readFileSync(saveFile);
        Object.assign(buckets, JSON.parse(data));
    } catch (err) {
        console.error(err);
    }
};


// load buckets from file on startup
loadBuckets();


// save buckets to file every 30 seconds
setInterval(saveBuckets, 1000 * 60);


// save buckets to file on exit
process.on('SIGINT', () => {
    saveBuckets();
    process.exit();
});


module.exports = router;