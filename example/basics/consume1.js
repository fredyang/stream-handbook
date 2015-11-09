//(echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume1.js
process.stdin.on('readable', function () {
    var buf = process.stdin.read(3);
    console.dir(buf);
});
