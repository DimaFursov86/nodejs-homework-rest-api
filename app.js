const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require("dotenv").config()
const path = require("path");
const fs = require("fs");

const authRouter = require("./routes/api/auth");
// const usersRouter = require("./routes/api/users");
const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(logger('combined', { stream: accessLogStream }))

app.use("/api/auth", authRouter);
// app.use("/api/users", usersRouter);
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({ message })
})

module.exports = app
