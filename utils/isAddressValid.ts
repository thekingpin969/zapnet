import bs58check from "bs58check";

export function isAddressValid(address: string): boolean {
    if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) return false;
    try {
        bs58check.decode(address);
        return true;
    } catch (e) {
        return false;
    }
}

export default isAddressValid