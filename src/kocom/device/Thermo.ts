import DeviceIf from "./DeviceIf";
import {Mqtt} from "../../mqtt";


enum RoomPacket {
    "00" = '거실',
    "01" = '안방',
    "02" = '작은방',
    "03" = '방3',
}

enum PowerState {
    '0000' = 'off',
    '0011' = 'on'
}

type PowerState_KEY = keyof typeof PowerState
type RoomPacket_KEY = keyof typeof RoomPacket

export default class Thermo implements DeviceIf {
    mqtt: Mqtt;
    constructor() {
        this.mqtt = Mqtt.getInstance();
        if(!this.mqtt.client.connected){

        }
    }

    sendMsg(topic:string,sendMsg: string) {
        console.log("Thermo sendMsg");
    }

    searchMsg(msg: string) {
        global.kocom?.write(Buffer.from(msg, 'hex'));
        console.log("Thermo receiveMsg");
    }

    receiveMsg(msg: string) {
        const hex = msg.match(/.{2}/g)!;

        const comm = hex.slice(0, 2).join('');        // 송수신구분 (30bc: 송신, 30dc: 수신)
        let roomId = hex[6];
        const cmd = hex.slice(4, 6).join('');         // 명령/이벤트 코드
        const powerStatus = hex[8] === '11'
        const awayStatus  = hex[9] === '01' && powerStatus

        const curTemp     = parseInt(hex[13] + hex[12], 16);
        const setTemp = parseInt(hex[11] + hex[10], 16);

        console.log('온도 조절기 >>', RoomPacket[roomId as RoomPacket_KEY], "전원 상태:", powerStatus, "외출 모드:", awayStatus, "현재 온도:", curTemp, "설정 온도:", setTemp);
    }

}