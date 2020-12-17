const express = require('express')
const app = express() 
const morgan = require('morgan')
const mongoose = require('mongoose')
/* Error handling for jwt
The default behavior is to throw an error when the token is
invalid, so you can add your custom logic to manage unauthorized access as follows: */
const expressjwt = require('express-jwt')
const cors = require('cors')
const port = process.env.PORT || 5000;
require("dotenv").config()

const secret = process.env.SECRET || "unicorntomatofastcloudy"

const path = require("path")
const connectDB = require('./config/db')

connectDB()


// ... other app.use middleware 
app.use(express.static(path.join(__dirname, "client", "build")))

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


app.use('/auth', require('./routes/authRouter')) // for signup and login
app.use('/api', expressjwt({secret: secret})) // Remember: The token is in the header
app.use('/api/issue', require('./routes/issueRouter'))
app.use('/api/comment', require('./routes/commentRouter'))

app.use((err, req, res, next) => {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})



// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


app.listen(port, () => {
    console.log('Server is running on local port 9000')
})

//////

// // ... other imports 
// const path = require("path")

// // ... other app.use middleware 
// app.use(express.static(path.join(__dirname, "client", "build")))

// // ...
// // Right before your app.listen(), add this:
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });


//////




// BASIC USAGE FOR JWT
// Basic usage using an HS256 secret:
// var jwt = require('express-jwt');
 
// app.get('/protected',
//   jwt({ secret: 'shhhhhhared-secret' }),
//   function(req, res) {
//     if (!req.user.admin) return res.sendStatus(401);
//     res.sendStatus(200);
// });