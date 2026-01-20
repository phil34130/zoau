const path = require('path');
const express = require('express');

const routes = require('./routes');
const app = express();

const middlewares = [
  // Serves static .html, .js, .css file, etc.
  express.static(path.join(__dirname, 'public')),
  // Parse requests containing json.
  express.json(),
  // Parse requests containing urlencoded bodies.
  express.urlencoded({ extended: true }),
];
app.use(middlewares);

app.use('/', routes);

// Page Not Found handler.
app.use((req, res, next) => {
  res.status(404).json('Sorry, page not found!');
});

// Server Error handler.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(err.message);
});

// Using port 3000 for this example; can be changed to a port of your choice.
app.listen(8080, () => {
  console.log(`App running at http://localhost:8080`);


});
