import DeviceIf from "./DeviceIf";
import receiveMsg from "../receiveMsg";
export enum LIGTH_TYPE {
    "000e" = '조명',
    "0001" = '거실',
    "0101" = '방1',
    "0201" = '방2',
    "0301" = '방3',
    "0401" = '주방',
}
export type LIGTH_TYPE_KEY = keyof typeof LIGTH_TYPE

const status = {
    Light: {
        room1: false,
        room2: false,
    }
}

export default class Light implements DeviceIf {
    sendMsg(sendMsg: string) {
        global.kocom?.emit('data',sendMsg)
    }
    searchMsg(msg: string) {
        console.log("Light receiveMsg");
    }
    receiveMsg(msg: string) {
        const type =  msg.slice(4,8) as LIGTH_TYPE_KEY // 다른방이있는경우 로직추가 필요~
        status.Light.room1 = msg.slice(16,18) == 'ff'
        status.Light.room2 = msg.slice(18,20) == 'ff'
        console.log("Light receiveMsg", LIGTH_TYPE[type], status.Light.room1, status.Light.room2);
    }
}