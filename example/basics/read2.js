//this program allow you pipe a readable stream to another
//writable, the writable stream

var Readable = require('stream').Readable;
var rs = Readable();

var c = 97 - 1;

rs._read = function () {
    if (c >= 'z'.charCodeAt(0)) return rs.push(null);

    //setTimeout is necessary because the operating system
    //requires some time to send us the relevant signals to
    //close the pipe
    setTimeout(function () {
        rs.push(String.fromCharCode(++c));
    }, 100);
};

//the readable stream can use as the source
//for piping
rs.pipe(process.stdout);

//this handler is necessary because the operating system will
//send SIGPIPE to our process when writable stream is
//no longer interested in readable output, which
//gets emitted as EPIPE error on process.stdout
process.on('exit', function () {
    console.error('\n_read() called ' + (c - 97) + ' times');
});


process.stdout.on('error', process.exit);
