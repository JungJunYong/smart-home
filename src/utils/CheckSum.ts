export default function CheckSum(hexData: string) {
    let checksum = 0;
    for (let i = 0; i < hexData.length; i += 2) {
        const byte = hexData.slice(i, i + 2);
        if (byte.length < 2) {
            break;
        }
        checksum = (checksum + parseInt(byte, 16)) % 256;
    }
    return checksum.toString(16).toLowerCase().padStart(2, '0');
}