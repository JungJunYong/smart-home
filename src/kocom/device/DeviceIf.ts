
export default interface DeviceIf {
    sendMsg: (topic: string,sendMsg: string) => void;
    searchMsg: (msg: string) => void;
    receiveMsg: (msg: string) => void;
}