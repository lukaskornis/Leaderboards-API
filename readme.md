# simple Leaderboard API

### Board Routes
/boards                         - all board names
/boards/:board                  - all scores for a board
/boards/:board/:min-:max        - scores between min and max
/boards/:board/:name            - 1 score with position
/boards/:board/delete           - remove a board
/boards/:board/:name/:score     - add a score to a board

### Bucket Board Routes
/buckets                        - all bucket board names
/buckets/:board                 - all scores for a bucket board
/buckets/:board/:number         - increment a specific bucket
/buckets/:board/delete          - remove a bucket board

### Settings Routes
/boards/:board/range/:min-:max  - set the range for a board
/boards/:board/size/:size       - set the max size for a board
/boards/:board/clear/:interval  - set the clear interval in minutes

### Additional Features
- rate limiting
- lowercase formating
- periodic saving