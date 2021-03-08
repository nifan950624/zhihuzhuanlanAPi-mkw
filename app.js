var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const cors = require('cors')
const fs = require('fs')
const request = require('./request/main')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use((req, res, next) => {
  setTimeout(() => {
    next()
  }, 1000)
})

const special = {}

fs.readdirSync(path.join(__dirname, 'module')).reverse().forEach((file) => {
  if (!file.endsWith('.js')) return
  let route =
    file in special
    ? special[file]
    : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/')
  let question = require(path.join(__dirname, 'module', file))

  app.use('/api' + route, (req, res) => {
    let query = Object.assign(
      {},
      req.query,
      req.body,
      req.files
    )
    let Authorization = req.get('Authorization') || ''

    question(query, request, { Authorization }).then((answer) => {
      console.log('[OK]', decodeURIComponent(req.originalUrl))
      res.send(answer)
    }).catch((answer) => {
      console.log('[ERR]')
      res.send(answer)
    })
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
