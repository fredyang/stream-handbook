//using stream.unshift prevents us from
//making unnecessary buffer copies.
//cat lines.js | node lines.js
var offset = 0;

var linefeed = 0x0a;

process.stdin.on('readable', function () {
    var buffer = process.stdin.read();

    if (!buffer) {
        return;
    }

    for (; offset < buffer.length; offset++) {
        if (buffer[offset] === linefeed) {
            //display the buffer up to the linefeed
            console.log(buffer.slice(0, offset).toString());

            //truncate the buffer after the linefeed
            buffer = buffer.slice(offset + 1);
            offset = 0;

            //and put it back readable stream
            process.stdin.unshift(buffer);
            return;
        }
    }

    process.stdin.unshift(buffer);
});
