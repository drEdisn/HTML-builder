const fs = require('fs');
const path = require('path');

const getFileInfo = (folder) => {
  fs.readdir(path.join(__dirname, 'secret-folder', `${folder}`), 
    { withFileTypes: true },
    (err, files) => {
      if (err) {
        throw err;
      } else {
        files.forEach(file => {
          if (!(file.isFile() === false)) {
            fs.stat(path.join(__dirname, 'secret-folder', `${folder}`, `${file.name}`), 
              (err, stats) => {
                if (err) {
                  throw err;
                } else { 
                  console.log(`${file.name.split('.')[0]} - ${path.extname(file.name) ? path.extname(file.name) : null } - ${stats.size/1024} Кб`); 
                }
              }
            );
          }
        });
      }
    }
  );
};

getFileInfo('');
