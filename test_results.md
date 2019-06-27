## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

### PATCH `/api/articles/1`

Assertion: expected { Object (updatedArticle) } to contain key 'article'

Hints:
- send the updated article with a key of `article`


### PATCH `/api/articles/1`

Assertion: Cannot read property 'votes' of undefined

Hints:
- increment / decrement the `votes` of the specified article with the knex method **`increment`**


### PATCH `/api/articles/1`

Assertion: Cannot read property 'votes' of undefined

Hints:
- ignore a `patch` request with no information in the request body, and send the unchanged article to the client
- provide a default argument of `0` to the `increment` method, otherwise it will automatically increment by 1


### POST `/api/articles/1/comments`

Assertion: expected { Object (newComment) } to contain key 'comment'

Hints:
- send the new comment back to the client in an object, with a key of comment: `{ comment: {} }`
- ensure all columns in the comments table match the README


### POST `/api/articles/1/comments`

Assertion: Cannot read property 'votes' of undefined

Hints:
- default `votes` to `0` in the migrations
- default `created_at` to the current time in the migrations


### PATCH `/api/comments/1`

Assertion: expected { Object (updatedComment) } to contain key 'comment'

Hints:
- send the updated comment back to the client in an object, with a key of comment: `{ comment: {} }`


### PATCH `/api/comments/1`

Assertion: Cannot read property 'votes' of undefined

Hints:
- increment / decrement the `votes` of the specified article with the knex method **`increment`**


### PATCH `/api/comments/1`

Assertion: expected 400 to equal 200

Hints:
- use 200: OK status code when sent a body with no `inc_votes` property
- send an unchanged comment when no `inc_votes` is provided in the request body


### PATCH `/api/comments/1000`

Assertion: expected 200 to equal 404

Hints:
- use a 404: Not Found when `PATCH` contains a valid comment_id that does not exist


