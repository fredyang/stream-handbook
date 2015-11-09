//(echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume0.js
process.stdin.on('readable', function () {
    var buf = process.stdin.read();
    console.dir(buf);
});
