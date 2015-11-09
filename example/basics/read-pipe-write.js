//we don't need to sub-class a Readable, instead
//just create an instance
var Readable = require('stream').Readable;
var rs = Readable();
rs.setEncoding('utf8');

var c = 97;
rs._read = function () {
    rs.push(String.fromCharCode(c++));
    if (c > 'z'.charCodeAt(0)) rs.push(null);
};



var Writable = require('stream').Writable;
var ws = Writable({ objectMode: true });
ws._write = function (chunk, enc, next) {
    console.log(chunk);
    //if you passing a error object
    //like next(error), ws will emit a 'error' event
    //
    next();
};


rs.pipe(ws);
