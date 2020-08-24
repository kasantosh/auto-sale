const express = require('express');
const morgan = require('morgan');

const userRouter = require('./router/userRouter');

const app = express();

// MIDDLEWARE

app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Logged at: ', new Date());
  next();
});

// app.get('/api/v1/users', getAllUsers).post();
// app.get('/api/v1/users/:id', getUser);
// app.post('/api/v1/users', createUser);
// app.patch('/api/v1/users/:id', updateUser);
// app.delete('/api/v1/users/:id', deleteUser);
app.use('/api/v1/users', userRouter);

// START SERVER
const port = 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
