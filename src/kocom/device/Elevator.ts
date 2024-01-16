import DeviceIf from "./DeviceIf";

export default class Elevator implements DeviceIf {
    sendMsg(sendMsg: string) {
        console.log("sendMsg");
    }
    searchMsg(msg: string) {
        console.log("receiveMsg");
    }
    receiveMsg (msg: string) {
        console.log("receiveMsg");
    }
}