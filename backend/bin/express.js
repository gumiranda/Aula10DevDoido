/* eslint-disable import/order */
/* eslint-disable no-use-before-define */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const variables = require('./configuration/variables');
const userRouter = require('../routes/user-router');
const cardRouter = require('../routes/card-router');
const transactionRouter = require('../routes/transaction-router');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// eslint-disable-next-line no-unused-vars
let connectedUsers = {};

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin), // || '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,HEAD,DELETE,OPTIONS',
    );
  res.header(
    'Access-Control-Allow-Headers',
    'content-Type,x-requested-with,Authorization',
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(variables.Database.connection, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

app.use('/api/user', userRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/card', cardRouter);

const port = process.env.PORT || 3333;

server.listen(port, () => {
  io.on('connection', (socket) => {
    const { user_id } = socket.handshake.query;
    connectedUsers[user_id] = socket.id;
    //console.log('teste', connectedUsers, connectedUsers[user_id]);
  });

  console.info('Servidor rodando na porta' + port);
});

module.exports = server;
