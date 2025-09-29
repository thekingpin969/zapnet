import axios from "axios";

export async function isAddressActive(address: string): Promise<boolean> {
    try {
        const res = await axios.get(`https://api.trongrid.io/v1/accounts/${address}`);
        const data = res.data;
        if (!data.data || data.data.length === 0) return false
        const account = data.data[0];
        const isActive = !!account.address;
        return isActive
    } catch (error) {
        console.error("Error checking TRON address:", error);
        return false;
    }
}

export default isAddressActive