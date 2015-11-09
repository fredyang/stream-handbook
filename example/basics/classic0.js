var Stream = require('stream');
var stream = new Stream;
stream.readable = false;
//console.log(stream.readable);

var c = 64;
var iv = setInterval(function () {
    if (++c >= 75) {
        clearInterval(iv);
        stream.emit('end');
    }
    else {
        stream.emit('data', String.fromCharCode(c));
    }
}, 100);

stream.pipe(process.stdout);
