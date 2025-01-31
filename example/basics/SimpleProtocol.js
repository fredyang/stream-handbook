// A parser for a simple data protocol.
// The "header" is a JSON object, followed by 2 \n characters, and
// then a message body.
//
// NOTE: This can be done more simply as a Transform stream!
// Using Readable directly for this is sub-optimal.  See the
// alternative example below under the Transform section.

var Readable = require('stream').Readable;
var util = require('util');

util.inherits(SimpleProtocol, Readable);

function SimpleProtocol(source, options) {
    if (!(this instanceof SimpleProtocol)) {
        return new SimpleProtocol(source, options);
    }

    Readable.call(this, options);
    this._inBody = false;
    this._sawFirstCr = false;

    // source is a readable stream,
    // such as a socket or file
    this._source = source;

    var self = this;
    source.on('end', function () {
        self.push(null);
    });

    // give it a kick whenever the source is readable
    // read(0) will not consume any bytes
    source.on('readable', function () {
        self.read(0);
    });

    this._rawHeader = [];
    this.header = null;
}

SimpleProtocol.prototype._read = function (n) {
    if (!this._inBody) {
        var chunk = this._source.read();

        // if the source doesn't have data, we don't have data yet.
        if (chunk === null) {

            return this.push('');
        }

        // check if the chunk has a \n\n
        var split = -1;
        for (var i = 0; i < chunk.length; i++) {
            if (chunk[i] === 10) { // '\n'
                if (this._sawFirstCr) {
                    split = i;
                    break;
                } else {
                    this._sawFirstCr = true;
                }
            } else {
                this._sawFirstCr = false;
            }
        }

        if (split === -1) {
            // still waiting for the \n\n
            // stash the chunk, and try again.
            this._rawHeader.push(chunk);
            this.push('');
        } else {
            this._inBody = true;
            var h = chunk.slice(0, split);
            this._rawHeader.push(h);
            var header = Buffer.concat(this._rawHeader).toString();
            try {
                this.header = JSON.parse(header);
            } catch (er) {
                this.emit('error', new Error('invalid simple protocol data'));
                return;
            }

            // now, because we got some extra data, unshift the rest
            // back into the read queue so that our consumer will see it.
            var b = chunk.slice(split);
            this.unshift(b);
            // calling unshift by itself does not reset the reading state
            // of the stream; since we're inside _read, doing an additional
            // push('') will reset the state appropriately.
            this.push('');

            // and let them know that we are done parsing the header.
            this.emit('header', this.header);
        }

    } else {
        // from there on, just provide the data to our consumer.
        // careful not to push(null), since that would indicate EOF.
        var chunk = this._source.read();
        if (chunk) this.push(chunk);
    }
};

// Usage:
// var parser = new SimpleProtocol(source);
// Now parser is a readable stream that will emit 'header'
// with the parsed header data.


var fs = require('fs');
var readable = fs.createReadStream('test.json');
var s = new SimpleProtocol(readable);
s.on('header', function (header) {
    console.log(header);
});

