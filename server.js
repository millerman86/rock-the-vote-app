const express = require('express')
const morgan = require('morgan')
const expressjwt = require('express-jwt')
const cors = require('cors')
const path = require("path")

const secret = process.env.SECRET || "unicorntomatofastcloudy"

const connectDB = require('./config/db')


const app = express() 
require("dotenv").config()
connectDB()


// ... other app.use middleware 

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


app.use('/auth', require('./routes/authRouter')) // for signup and login
app.use('/api', expressjwt({secret: secret, algorithms: ['RS256']})) // Remember: The token is in the header
app.use('/api/issue', require('./routes/issueRouter'))
app.use('/api/comment', require('./routes/commentRouter'))

app.use((err, req, res, next) => {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})

console.log('test');

app.use(express.static(path.join(__dirname, "client", "build")))
// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


app.listen(process.env.PORT || 9000, () => {
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