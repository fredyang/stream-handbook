//(echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume2.js
process.stdin.on('readable', function () {
    var buf = process.stdin.read(3);
    console.dir(buf);
    process.stdin.read(0);
});
