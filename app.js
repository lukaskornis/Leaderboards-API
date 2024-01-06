const express = require('express');
const rateLimit = require('express-rate-limit');
const bucketRoute = require('./routes/bucketRoute');
const boardRoute = require('./routes/boardRoute');

const app = express();
const port = process.env.PORT || 80;


const limiter = rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 20 // limit each IP to 20 requests
});
app.use(limiter);

const toLowerCaseMiddleware = (req, res, next) => {
    req.url = req.url.toLowerCase();
    next();
};
app.use(toLowerCaseMiddleware);

app.use("/boards", boardRoute);
app.use("/buckets", bucketRoute);

app.get('/', (req, res) => {
    res.send('SimVik Leaderboard API!');
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