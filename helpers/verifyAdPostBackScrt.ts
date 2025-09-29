const AD_POSTBACK_SCRT = process.env.AD_POSTBACK_SCRT || '';

function verifyAdPostBackScrt(scrt: string) {
    try {
        if (scrt.length !== AD_POSTBACK_SCRT.length) return false;
        let isMatch = 0;
        for (let i = 0; i < scrt.length; i++) {
            isMatch |= scrt.charCodeAt(i) ^ AD_POSTBACK_SCRT.charCodeAt(i);
        }
        return isMatch === 0;
    } catch (error) {
        throw error
    }
}

export default verifyAdPostBackScrt