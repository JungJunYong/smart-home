import DeviceIf from "./DeviceIf";
import {Mqtt} from "../../mqtt";
import CheckSum from "../../utils/CheckSum";
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
    sendMsg(topic:string,sendMsg: string) {
        const regex =  /\/([^\/]+)\//;
        const type = topic.match(regex)![1]!.split('_')[1];
        const Room = type.replace(/[^0-9]/g,'');
        const state = JSON.parse(sendMsg).state == 'ON' ? 'ff' : '00';
        status.Light[`room${Room}` as keyof typeof status.Light ] = JSON.parse(sendMsg).state == 'ON'
        const sendMessage =  this.createMessage({room1:status.Light.room1,room2:status.Light.room2})
        global.kocom?.write(Buffer.from(sendMessage, 'hex'));
        console.log('sendMsg',sendMessage.toString());
    }
    searchMsg(msg: string) {
        console.log("Light receiveMsg");
    }
    receiveMsg(msg: string) {
        console.log("여기",msg);
        //
        const type =  msg.slice(4,8) as LIGTH_TYPE_KEY // 다른방이있는경우 로직추가 필요~
        status.Light.room1 = msg.slice(16,18) == 'ff'
        status.Light.room2 = msg.slice(18,20) == 'ff'

        this.mqtt.publish('kocom/livingroom_light1/state', {state: status.Light.room1 ? 'ON' : 'OFF'})
        this.mqtt.publish('kocom/livingroom_light2/state', {state: status.Light.room2 ? 'ON' : 'OFF'})
        console.log("Light receiveMsg", LIGTH_TYPE[type], status.Light.room1, status.Light.room2);
    }

    createMessage(status: {room1: boolean, room2: boolean}){
        const msg = `30bc000e00010000${status.room1?'ff':'00'}${status.room2?'ff':'00'}000000000000`
        return `aa55${msg}${CheckSum(msg)}0d0d`
    }



    addAssistant(){
        const topic = 'homeassistant/light/livingroom_light1/config'
        const payload = {
            "~": "homeassistant/light/livingroom",
            "name": "livingroom",
            "uniq_id": "livingroom_light1",
            "cmd_t": "~/set",
            "stat_t": "~/state",
            "schema": "json",
            "brightness": true
        }
    }
}