import DeviceIf from "./DeviceIf";

enum FanState {
    꺼짐 = '16',
    '1단계' = '20',
    '2단계' = '24',
    '3단계' = '28',
}

export default class Fan implements DeviceIf {
    sendMsg(sendMsg: string) {
        console.log("Fan sendMsg");
    }
    searchMsg(msg: string) {
        console.log("Fan searchMsg");
    }
    receiveMsg(msg: string) {
        console.log("Fan receiveMsg",msg);
        const state = parseInt(msg.slice(19,21),16).toString();
        console.log('환기 상태',this.getKeyByValue(FanState, state))
        // 30bc000100480000000100000000000036
        // 30bc000100480000110140000000000087 켜져있을때 1단계
        // 30bc0001004800001101800000000000c7 켜져있을때 2단계
        // 30bc0001004800001101c0000000000007 켜져있을때 3단계
        // 30bd000100480000110140000000000088 켜져있을때
    }

    getKeyByValue<T extends { [key: string]: string }>(object: T, value: string): keyof T | undefined {
        return (Object.keys(object) as Array<keyof T>).find(key => object[key] === value);
    }
}