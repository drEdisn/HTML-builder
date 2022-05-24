const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = require('process');

fs.writeFile(
  path.join(__dirname, 'text.txt'),
  '',
  (err) => {
    if (err) throw err;
  }
);
 
let read = readline.createInterface({
  input: stdin,
  output: stdout
});

console.log('Write text here: ');

read.on('line', (input) => {
  if (input === 'exit') {
    read.close();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), `${input}\n`, err => {if (err) throw err;});
  }
});

read.on('close', () => console.log('Exit complete'));