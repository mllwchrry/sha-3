const permute = require('./permutations');

const r = 1088;
const b = 1600;

function pad(x, m) {
    let j = Math.abs((-m - 2) % x);
    let P = [1];
    for (let i = 0; i < j; i++)
        P.push(0);
    return P.push(1);
}

function sha3(N, d) {
    let P = N.concat(pad(r, N.length));
    let n = P.length / r;
    let c = b - r;

    let S = new Array(b).fill(0);
    const cZeros = new Array(c).fill(0);
    for (let i = 0; i < n - 1; i++)
        S = permute(xorArray(S, P.slice(i, i + r).concat(cZeros)))

    let Z = [];
    Z = Z.concat(S.slice(0, r));
    while (d > Z.length) {
        S = permute(S);
        Z = Z.concat(S.slice(0, r));
    }

    return Z.slice(0, d);
}

function xorArray(a, b) {
    if (a.length !== b.length)
        throw new Error('Values have to be the same length for XOR to be performed');

    let result = [];
    for (let i = 0; i < a.length; i++)
        result.push(a[i] ^ b[i])
    return result;
}
