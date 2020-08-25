// START SERVER
const app = require('./app');

const port = 8000;
console.log(app.get('env'));
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
