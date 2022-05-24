const fs = require('fs');
const path = require('path');
const { copyFile } = require('fs/promises');

const cssBundle = () => {
  fs.readdir(path.join(__dirname, 'styles'), 
    { withFileTypes: true },
    (err, files) => {
      if (err) {
        throw err;
      } else {
        files.forEach(i => {
          if (i.isFile() === true && path.extname(i.name) == '.css') {
            const stream = fs.createReadStream(path.join(__dirname, 'styles' ,`${i.name}`), 'utf-8');
            stream.on('data', function (val){
              fs.writeFile(
                path.join(__dirname, 'project-dist', 'style.css'),'',(err) => {if (err) {
                  throw err;
                } else {
                  fs.appendFile(
                    path.join(__dirname, 'project-dist', 'style.css'),
                    `${val}`,
                    (err) => {
                      if (err) throw err;
                    }
                  );
                }});
            });
          }
        });
      }
    }
  );
};

const htmlBundle = () => {
  const stream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  stream.on('data', item => {
    let arr = item.split('\n').map(i => {if(i.includes('{')) {return i.replace(/[{} \r]/g, '');} else {return i;}});
    fs.readdir(path.join(__dirname, 'components'),
      { withFileTypes: true },
      (err, files) => {
        if (err) {
          throw err;
        } else {
          files.forEach(file => {
            if (file.isFile() === true && path.extname(file.name) == '.html' && arr.includes(`${file.name.replace(/.html/, '')}`)) {
              let st = fs.createReadStream(path.join(__dirname, 'components', `${file.name}`), 'utf-8');
              st.on('data', i => {
                arr.splice(arr.indexOf(`${file.name.replace(/.html/g, '')}`), 1, i);
                fs.writeFile(
                  path.join(__dirname, 'project-dist', 'index.html'),
                  `${arr.join('\n')}`,
                  (err) => {
                    if (err) {
                      throw err;
                    }
                  }
                );
              });
            }
          });
        }
      }
    );
  });
};

const assetsCopy = () => {
  fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true}, 
    (err) => {
      if (err) {
        throw err;
      } else {
        fs.readdir(path.join(__dirname, 'assets'),
          (err, dirs) => {
            if (err) {
              throw err;
            } else {
              dirs.forEach(dir => {
                fs.mkdir(path.join(__dirname, 'project-dist', 'assets', `${dir}`), {recursive: true}, 
                  (err) => {
                    if (err) {
                      throw err;
                    } else {
                      fs.readdir(path.join(__dirname, 'assets', `${dir}`),
                        (err, files) => {
                          if (err) {
                            throw err;
                          } else {
                            files.forEach(file => {
                              copyFile(path.join(__dirname, 'assets', `${dir}`, `${file}`), `${path.join(__dirname, 'project-dist', 'assets', `${dir}`, `${file}`)}`);
                            });
                          }
                        });
                    }
                  }
                );
              });
            }
          });
      }
    });
};

fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, (err) => {
  if (err) {
    throw err;
  } else {
    htmlBundle();
    cssBundle();

    assetsCopy();
    fs.readdir(path.join(__dirname, 'project-dist', 'assets'), 
      (err, dirs) => {
        if (err) {
          throw err;
        } else {
          dirs.forEach(dir => {
            fs.readdir(path.join(__dirname, 'project-dist', 'assets', `${dir}`),
              (err, files) => {
                if (err) {
                  throw err;
                } else {
                  files.forEach(file => {
                    fs.unlink(path.join(__dirname, 'project-dist', 'assets', `${dir}`, `${file}`), (err) => {if (err) {throw err;}});
                  });
                  assetsCopy();
                }
              });
          });
        }
      }
    );
  }
});