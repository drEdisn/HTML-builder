const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'styles'), 
  { withFileTypes: true },
  (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(i => {
        if (i.isFile() === true && path.extname(i.name) == '.css') {
          const stream = fs.createReadStream(path.join(__dirname, 'styles' ,`${i.name}`), 'utf-8');
          stream.on('data', function (val){
            fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'),
              '',
              (err) => {
                if (err) {
                  throw err;
                } else {
                  fs.appendFile(
                    path.join(__dirname, 'project-dist', 'bundle.css'),
                    `${val}`,
                    (err) => {
                      if (err) throw err;
                    }
                  );
                }
              }
            );
          });
        }
      });
    }
  }
);