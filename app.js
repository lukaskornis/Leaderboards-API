const express = require('express');
const rateLimit = require('express-rate-limit');
const bucketRoute = require('./routes/bucketRoute');
const boardRoute = require('./routes/boardRoute').router;
const toLowerCaseMiddleware = require('./middlewares/toLowerCaseMiddleware');

const app = express();
const port = process.env.PORT || 3000;

app.use(rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 20 // limit each IP to 20 requests
}));

app.use(toLowerCaseMiddleware);

app.use("/boards", boardRoute);
app.use("/buckets", bucketRoute);

app.get('/', (req, res) => {
    res.send('Sim&Vik Leaderboard API!');
});

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// undefined routes
app.all('*', (req, res) => {
    res.status(404).send('?');
});

app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    console.log(`listening at ${port} port`);
});