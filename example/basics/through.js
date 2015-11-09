//(echo beep; sleep 1; echo boop) | node through.js
//npm install through
 through = require('through');
process.stdin.pipe(through(write, end));

function write (buf) {
    console.log(buf);
}
function end () {
    console.log('__END__');
}
