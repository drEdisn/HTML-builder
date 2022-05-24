const fs = require('fs');
const path = require('path');
const { copyFile } = require('fs/promises');

const copyFiles = () => {
  fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
    if (err) {
      throw err;
    } else {
      fs.readdir(path.join(__dirname, 'files'),
        (err, files) => {
          if (err) {
            throw err;
          } else {
            files.forEach(file => {
              copyFile(path.join(__dirname, 'files', `${file}`), `${path.join(__dirname, 'files-copy', `${file}`)}`);
            });
          }
        }
      );
    }
  });
};

fs.stat(path.join(__dirname, 'files-copy'), (err) => {
  if (!err) {
    fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
      if (err) {
        throw err;
      } else {
        files.forEach(file => {
          fs.unlink(path.join(__dirname, 'files-copy', `${file}`), (err) => {if (err) {throw err;}});
        });
        copyFiles();
      }
    });
  } else {
    copyFiles();
  }
});