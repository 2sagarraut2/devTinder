# devTinder

### authRouter

- POST /signup
- POST /login
- POST /logout

### profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

### connectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST request/review/accepted/:requestId
- POST request/review/rejected/:requestId

- GET /user/connection
- GET /user/requests
- GET /user/feed - gets you profile of other users on platform
