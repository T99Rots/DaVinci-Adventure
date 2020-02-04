const fs = require('fs');
const path = require('path');

[
  './default.json',
  './development.json'
].map(file => {
  file = path.join(__dirname, file);
  if (fs.existsSync(file)) {
    Object.assign(exports, require(file));
  }
});
