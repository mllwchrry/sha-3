const W = 64;
const l = 6;

function permute(A, round) {
    A = theta(A);
    A = rho(A);
    A = pi(A);
    A = chi(A);
    return iota(A, round);
}

function theta(A) {

    const C = new Array(5).fill(0).map(() => new Array(W).fill(0));
    const D = new Array(5).fill(0).map(() => new Array(W).fill(0));
    const B = Array.from({length: 5},
        () => Array.from({length: 5},
            () => new Array(W).fill(0)));

    for (let i = 0; i < 5; i++)
        for (let k = 0; k < W; k++)
            C[i][k] = A[i][0][k] ^ A[i][1][k] ^ A[i][2][k] ^ A[i][3][k] ^ A[i][4][k];

    for (let i = 0; i < 5; i++)
        for (let k = 0; k < W; k++)
            D[i][k] = C[Math.abs((i - 1) % 5)][k] ^ C[(i + 1) % 5][Math.abs((k - 1) % W)];

    for (let i = 0; i < 5; i++)
        for (let j = 0; j < 5; j++)
            for (let k = 0; k < W; k++)
                B[i][j][k] = A[i][j][k] ^ D[i][k];

    return B;
}

function rho(A) {
    const B = Array.from({length: 5},
        () => Array.from({length: 5},
            () => new Array(W).fill(0)));

    for (let k = 0; k < W; k++)
        B[0][0][k] = A[0][0][k];

    let i = 1, j = 0;
    for (let t = 0; t < 24; t++) {
        for (let k = 0; k < W; k++) {
            B[i][j][k] = A[i][j][Math.abs((k - (t + 1) * (t + 2) / 2) % W)];
        }
        let i_tmp = j;
        let j_tmp = (2 * i + 3 * j) % 5;
        i = i_tmp;
        j = j_tmp;
        // console.log('i', i);
        // console.log('j', j);
    }

    return B;

}

function pi(A) {

    const B = Array.from({length: 5},
        () => Array.from({length: 5},
            () => new Array(W).fill(0)));

    for (let i = 0; i < 5; i++)
        for (let j = 0; j < 5; j++)
            for (let k = 0; k < W; k++)
                B[i][j][k] = A[(i + 3 * j) % 5][i][k]

    return B;

}

function chi(A) {

    const B = Array.from({length: 5},
        () => Array.from({length: 5},
            () => new Array(W).fill(0)));

    for (let i = 0; i < 5; i++)
        for (let j = 0; j < 5; j++)
            for (let k = 0; k < W; k++) {
                // console.log('test', !A[(i + 1) % 5][j][k])
                B[i][j][k] = A[i][j][k] ^ ((!A[(i + 1) % 5][j][k] && A[(i + 2) % 5][j][k]));
            }

    return B;
}

function iota(A, round) {

    const B = Array.from({length: 5},
        () => Array.from({length: 5},
            () => new Array(W).fill(0)));

    for (let i = 0; i < 5; i++)
        for (let j = 0; j < 5; j++)
            for (let k = 0; k < W; k++)
                B[i][j][k] = A[i][j][k];

    const RC = new Array(W).fill(0);
    for (let i = 0; i < l; i++)
        RC[Math.pow(2, i) - 1] = rc(i + 7 * round);

    for (let k = 0; k < W; k++)
        B[0][0][k] = B[0][0][k] ^ RC[k];

    return B;

}

function rc(t) {
    if (!(t % 255))
        return 1;

    let R = [1, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 1; i < t % 255; i++) {
        R.unshift(0);
        R[0] = R[0] ^ R[8];
        R[4] = R[4] ^ R[8];
        R[5] = R[5] ^ R[8];
        R[6] = R[6] ^ R[8];
        R = R.slice(0, 8);
    }

    return R[0];
}

function StateToA(state) {
    const A = Array.from({length: 5},
        () => Array.from({length: 5},
            () => new Array(W).fill(0)));

    for (let i = 0; i < 5; i++)
        for (let j = 0; j < 5; j++)
            for (let k = 0; k < W; k++)
                A[i][j][k] = state[(5 * i + j) * W + k];

    // console.log(A)
    return A;
}

function AToState() {

}

const binaryString = '0001111101110111111011110111000000001001011000010010100000101000100010100101110000000001110111000000110010000101011110000000010110010010010000010110011101000111111110110111010010011101010011110010111100100100011101001101101001010100010111111010010011010101100100000010000111010111001101100010011111001111111111011101001010111101101100001110010110101101000110000100100001011101010111010111100100100100101110100011010110110101011001101010110111010001001101000101101001101000110011001010110101010111011100010111010000000111110001111001101100110000100110011001100111101010101111110101010011000000010010011110011110010101001111111011110000011111011001001001011100100100111011110001100010111111100001010101100111110011100000011010000110110010010101101110011110101010110110001101110101101111011101000010110010000110100000011101100111111111111111001110100110010100111110011011001011011010101110010110100100001000011001110011011010011110101101100010011010000100011010110100011011111000010111100011111000111010000101011001101101110101100000111110100011001111011100110011110110010101011100010010111100000111110010010000110010101100001100111011110011100010010000101010001100110110101000100001111101110100000111101000010111000100011101101101110011100101000011000001000011100100000101000100111100100100111101011100011101001111101000100010110011110100101111000111100101000110010111000111011001001011100000110011111100001100001011000111000101110111011100111100001100111000100000101111001001001000011011011001110000100111001010010010011111100001111011111101010000111100100010011100110110101110111101101101100001001111'
const state = binaryString.split('').map((bit) => parseInt(bit, 2));

const A = StateToA(state);
// console.log('theta', theta(A));
// console.log('rho', rho(A));
// console.log('pi', pi(A));
// console.log('chi', chi(A));
// console.log('iota', iota(A, 2));
console.log(permute(A, 2));