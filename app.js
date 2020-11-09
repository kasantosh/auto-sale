const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const autoRouter = require('./routers/autoRouter');
const userRouter = require('./routers/userRouter');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// MIDDLEWARE (app.use)

// Set SECURITY HTTP headers 
// Helmet
app.use(helmet());

// login middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP. Please try again in an hour!'
});
 
app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '20kb'}));

// serve static files
app.use(express.static(`${__dirname}/public`));

// Development logging with date
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
