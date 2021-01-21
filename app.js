const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const autoRouter = require('./routers/autoRoutes');
const userRouter = require('./routers/userRoutes');
const reviewRouter = require('./routers/reviewRoutes');
const viewRouter = require('./routers/viewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.enable('trust proxy');

// Set up views engine as pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARE (app.use)

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set SECURITY HTTP headers 
// Helmet
app.use(helmet());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['year', 'make', 'price']
}));

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
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(cookieParser()); //  parser for front-end

// Data sanitization against noSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xss());

app.use(compression());

// Development logging with date
app.use((req, res, next) => {
  console.log('Logged at: ', new Date());
  // console.log(req.cookies);
  next();
});

// Routing middleware
app.use('/', viewRouter);
app.use('/api/v1/autos', autoRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// catch all unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
