const express = require('express');
const morgan = require('morgan');

const autoRouter = require('./routers/autoRouter');
const userRouter = require('./routers/userRouter');

const app = express();

// MIDDLEWARE

app.use(express.json());

app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Logged at: ', new Date());
  next();
});

// app.get('/api/v1/autos', getAllUsers).post();
// app.get('/api/v1/autos/:id', getUser);
// app.post('/api/v1/autos', createUser);
// app.patch('/api/v1/autos/:id', updateUser);
// app.delete('/api/v1/autos/:id', deleteUser);
app.use('/api/v1/autos', autoRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
