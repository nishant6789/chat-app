const http = require('http')
const express = require('express')
const logger = require('logger')
const cors = require('cors')
require("./config/mongo.js")

const indexRouter = require('./routes/index.js')
const userRouter = require('./routes/user.js')
const chatRoomRouter = require('./routes/chatRoom.js')

const {decode} = require('./middleware/jwt.js')

const app = express()

const port = process.env.port || "8085";
app.set("port",port)

// app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/room', decode, chatRoomRouter)

const server = http.createServer(app)
server.listen(port)
server.on("listening", ()=> {
    console.log(`Listening on port ${port}`)
})
