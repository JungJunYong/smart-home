import DeviceIf from "./DeviceIf";


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
    sendMsg(sendMsg: string) {
        console.log("Thermo sendMsg");
    }

    searchMsg(msg: string) {
        console.log("Thermo receiveMsg");
    }

    getTemperture(msg: string) {
        return parseInt(msg, 16);
    }

    receiveMsg(msg: string) {
        const room = msg.slice(12, 14) as RoomPacket_KEY
        const power = msg.slice(14, 18) as PowerState_KEY
        const temperture = this.getTemperture(msg.slice(18, 22));
        const setTemperture = this.getTemperture(msg.slice(22, 26));
        if (temperture === 266) {
            console.log('온도 조절기 >>', RoomPacket[room], '외출 설정온도:', setTemperture)
        } else {
            console.log("온도 조절기 >>", RoomPacket[room], PowerState[power], '현재온도' + temperture,  '설정온도' + setTemperture, msg);
        }

        // console.log("Thermo receiveMsg",msg);

        // 30bc0001003600 0011 010a 0014 00000053 거실 전원 On 외출 On 현재온도 20도 설정온도 22도
        // 30bc0001003601 0011 0016 0016 00000061 방 1 전원 On 외출 off 현재온도 22도 설정온도 22도
        // 30bc0001003601 0011 010a 0016 00000056 방1 전원 On 외출 On 현재온도 22도 설정온도 22도
        // 30bc0001003601 0000 010a 0016 00000045 방 1 전원 Off 외출 Off 현재온도 22도
        // 30bc0001003602 0011 010a 0014 00000055 방 2 전원 On 외출 On 현재온도 20도 설정온도 20도

    }

}