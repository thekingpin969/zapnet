function isValidUrl(str: string) {
    try {
        new URL(str);
        return true;
    } catch (e) {
        return false;
    }
}

export default isValidUrl