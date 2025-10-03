# Simple Node.js Leaderboard API
General purpose leaderboard and stats API built with Node.js, Express, all data held in memory.
All routes use GET requests for simple client integration.
Good fit to quickly add social features or anonymous statistics for the app.

| Route | Description |
| --- | --- |
| `/boards` | Get all board names |
| `/boards/:board` | Get all scores in a board |
| `/boards/:board/:min-:max` | Get all scores in a value range|
| `/boards/:board/:name` | Get 1 entry |
| `/boards/:board/delete` | Remove a board |
| `/boards/:board/:name/:score` | Add a key/value pair to a board |
| `/buckets` | Get all bucket board names |
| `/buckets/:board` | Get all scores for a bucket board |
| `/buckets/:board/:number` | Increment a specific bucket by 1|
| `/buckets/:board/delete` | Remove a bucket board |
| `/boards/:board/range/:min-:max` | Set the value range for a board (validation)|
| `/boards/:board/size/:size` | Set the max number of entries in a board (e.g. TOP100)|
| `/boards/:board/clear/:interval` | Set the board clear interval in minutes (Daily, Monthly boards)|

### Additional Features
- per IP request rate limiting
- data lowercase formating
- periodic persistent saving
- periodic board clearing
