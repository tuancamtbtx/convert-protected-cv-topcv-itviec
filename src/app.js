import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import config from './config'
import {
  error404Forwarder,
  errorDebugMiddleware,
  errorReleaseMiddleware
} from './middlewares/errorMiddleware'
import pdfRoute from './routes/pdf'
import uploadRoute from 'routes/uploadPdf'
// const fileUpload = require('express-fileupload');

var app = express()

// app.use(fileUpload());

app.use(function (req, res, next) {
  // TODO Need to define allowed domain
  // Website you wish to allow to connect
  if (app.get('env') === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Cache-Control, Authorization');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(morgan('dev'))

app.use('/pdf', pdfRoute)
app.use('/upload',uploadRoute)
// catch 404 and forward to error handler
app.use(error404Forwarder)

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(errorDebugMiddleware)
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use(errorReleaseMiddleware)
}

app.listen(config.port, () => {
  console.log('App listening !! ' + config.port)
})
