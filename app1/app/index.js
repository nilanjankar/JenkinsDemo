const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from app1!');
});

app.listen(port, () => {
  console.log(`App1 listening on port ${port}`);
});

module.exports = app;
