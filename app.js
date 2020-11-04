const express = require('express');
const morgan = require('morgan');

const autoRouter = require('./routers/autoRouter');
const userRouter = require('./routers/userRouter');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// MIDDLEWARE (app.use)

// body middleware
app.use(express.json());

// login middleware
app.use(morgan('dev'));

// serve static files middleware
app.use(express.static(`${__dirname}/public`));

// date logging middleware
app.use((req, res, next) => {
  console.log('Logged at: ', new Date());
  next();
});

// app.get('/api/v1/autos', getAllUsers).post();
// app.get('/api/v1/autos/:id', getUser);
// app.post('/api/v1/autos', createUser);
// app.patch('/api/v1/autos/:id', updateUser);
// app.delete('/api/v1/autos/:id', deleteUser);
// Routing middleware
app.use('/api/v1/autos', autoRouter);
app.use('/api/v1/users', userRouter);

// catch all unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
