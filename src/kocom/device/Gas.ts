import DeviceIf from "./DeviceIf";

export default class Gas implements DeviceIf {
    receiveMsg (msg: string) {
        console.log("gas receiveMsg");
    }
    sendMsg(topic:string,sendMsg: string) {
        console.log("sendMsg");
    }
    searchMsg(msg: string) {
        console.log("receiveMsg");
    }
}