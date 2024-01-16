
export default interface DeviceIf {
    sendMsg: (sendMsg: string) => void;
    searchMsg: (msg: string) => void;
    receiveMsg: (msg: string) => void;
}