# simple Leaderboard API

| Route | Description |
| --- | --- |
| `/boards` | All board names |
| `/boards/:board` | All scores for a board |
| `/boards/:board/:min-:max` | Scores between min and max |
| `/boards/:board/:name` | 1 score with position |
| `/boards/:board/delete` | Remove a board |
| `/boards/:board/:name/:score` | Add a score to a board |
| `/buckets` | All bucket board names |
| `/buckets/:board` | All scores for a bucket board |
| `/buckets/:board/:number` | Increment a specific bucket |
| `/buckets/:board/delete` | Remove a bucket board |
| `/boards/:board/range/:min-:max` | Set the range for a board |
| `/boards/:board/size/:size` | Set the max size for a board |
| `/boards/:board/clear/:interval` | Set the clear interval in minutes |

### Additional Features
- rate limiting
- lowercase formating
- periodic saving