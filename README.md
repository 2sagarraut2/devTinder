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

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

- GET /user/connection
- GET /user/requests
- GET /user/feed - gets you profile of other users on platform
