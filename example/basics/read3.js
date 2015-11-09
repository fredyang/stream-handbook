//we don't need to sub-class a Readable, instead
//just create an instance
var Readable = require('stream').Readable;

var c = 97;

var rs = Readable({
    read: function () {
        this.push(String.fromCharCode(c++));
        if (c > 'z'.charCodeAt(0)) {
            this.push(null);
        }
    }
});


rs.pipe(process.stdout);
