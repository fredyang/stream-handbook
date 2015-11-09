//readable event
/*The 'readable' event indicates
that the stream has new information:
either new data is available or the end
of the stream has been reached.
In the former case, .read() will
return that data. In the latter case,
.read() will return null. For instance,
in the following example, foo.txt is an
empty file:
* */
var fs = require('fs');
var readable = fs.createReadStream('test.js');
//if you don't send encoding
//the readable.read will get just byte array
readable.setEncoding('utf8');
readable.on('readable', function() {
    console.log('readable:', readable.read());
});
readable.on('end', function() {
    console.log('end');
});