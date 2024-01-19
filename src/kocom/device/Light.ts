import DeviceIf from "./DeviceIf";
import receiveMsg from "../receiveMsg";
import {Mqtt} from "../../mqtt";
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
    mqtt = Mqtt.getInstance();
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

        this.mqtt.publish('kocom/kitchen_light1/state', {state: status.Light.room1 ? 'ON' : 'OFF'})
        this.mqtt.publish('kocom/kitchen_light2/state', {state: status.Light.room2 ? 'ON' : 'OFF'})
        console.log("Light receiveMsg", LIGTH_TYPE[type], status.Light.room1, status.Light.room2);
    }

    addAssistant(){
        const topic = 'homeassistant/light/kitchen_light1/config'
        const payload = {
            "~": "homeassistant/light/kitchen",
            "name": "Kitchen",
            "uniq_id": "kitchen_light1",
            "cmd_t": "~/set",
            "stat_t": "~/state",
            "schema": "json",
            "brightness": true
        }
    }
}