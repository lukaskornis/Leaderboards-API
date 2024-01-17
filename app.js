const express = require('express');

const rateLimit = require('express-rate-limit');
const cors = require('cors');

const bucketRoute = require('./routes/bucketRoute');
const boardRoute = require('./routes/boardRoute').router;

const toLowerCaseMiddleware = require('./middlewares/toLowerCaseMiddleware');


const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    if (req.path.startsWith(`/piped`)) {
        req.path = req.path.substring(6);
        req.url = req.url.substring(6);
        req.originalUrl = req.originalUrl.substring(6);
        req.baseUrl = req.baseUrl.substring(6);
        req.piped = true;
    }
    next();
});

var oldSend = express.response.send;
express.response.send = function (body) {
    if (this.req.piped) {
        this.type('text/plain');
        if (Array.isArray(body)) {
            body = body.join('|');
        }
        else if (typeof body === 'object') {
            body = Object.entries(body).map(([key, value]) => `${key}|${value}`).join(',');
        }
    }
    oldSend.call(this, body);
}


express.response.json = function (body) {
    if (this.req.piped) {
        this.type('text/plain');
        if (Array.isArray(body)) {
            body = body.join('|');
        }
        else if (typeof body === 'object') {
            body = Object.entries(body).map(([key, value]) => `${key}|${value}`).join(',');
        }
    }
    oldSend.call(this, body);
}


app.use(rateLimit({
    windowMs: 1000 * 60, // 1 minute
    max: 20 // limit each IP to 20 requests
}));

app.use(cors({
    origin: '*', // allow all origins
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