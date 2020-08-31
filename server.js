const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// START SERVER
const app = require('./app');

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
