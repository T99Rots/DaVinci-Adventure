const fs = require('fs');
const path = require('path');

[
  './seed/default.json',
  './seed/development.json'
].map(file => {
  file = path.join(__dirname, file);
  if (fs.existsSync(file)) {
    Object.assign(exports, require(file));
  }
});
