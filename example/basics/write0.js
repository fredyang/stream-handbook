//consuming readable stream using writable stream
//call this method with
// (echo beep; sleep 1; echo boop) | node write0.js

var Writable = require('stream').Writable;
var ws = Writable({ objectMode: true });
ws._write = function (chunk, enc, next) {
    console.dir(chunk);
    //if you passing a error object
    //like next(error), ws will emit a 'error' event
    //
    next();
};

//consuming readable stream
//by piping to a writable stream
process.stdin.pipe(ws);
