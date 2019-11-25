# Tungtung authentication API

Packages:
* jsonwebtoken
* express

## Run

```code
<!-- Run dev server -->
npm run dev (automatic rerun server)

<!-- Production server -->
npm run prestart (build es6 to javascript native)
npm run start
```

Run server port `localhost:3000`

## Auth middleware

`src/middleware/authMiddleware.js`

Use middleware

```javascript
route.get('/me', authMiddleware, (req, res)=> {
    //req.user returned from authMiddleware, only work when token passed
    return res.json(req.user);
})
```