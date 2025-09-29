function encryptUserid(num: number) {
    const password = process.env.ENCODE_PASSWORD || ''
    const key = [...password].reduce((a, c) => a + c.charCodeAt(0), 0);
    return (BigInt(num) + BigInt(key)).toString(36);
}

function decryptUserid(enc: string) {
    const password = process.env.ENCODE_PASSWORD || ''
    const key = [...password].reduce((a, c) => a + c.charCodeAt(0), 0);
    return Number(BigInt(parseInt(enc, 36)) - BigInt(key));
}

export { encryptUserid, decryptUserid }