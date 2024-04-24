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
        room3: false,
        room4: false,
        room5: false,
    }
}

export default class Light implements DeviceIf {
    constructor() {
        this.mqtt = Mqtt.getInstance();
        if(!this.mqtt.client.connected){
            this.mqtt.client.on('connect', () => {
                this.publish();
            })
        }
    }

    mqtt: Mqtt;

    sendMsg(topic:string,sendMsg: string) {
        const regex =  /\/([^\/]+)\//;
        const type = topic.match(regex)![1]!.split('_')[1];
        const Room = type.replace(/[^0-9]/g,'');
        status.Light[`room${Room}` as keyof typeof status.Light ] = JSON.parse(sendMsg).state == 'ON'
        const sendMessage =  this.createMessage({room1:status.Light.room1,room2:status.Light.room2})
        global.kocom?.write(Buffer.from(sendMessage, 'hex'));
    }
    searchMsg(msg: string) {
        console.log("Light receiveMsg");
    }
    receiveMsg(msg: string) {
        // const type =  msg.slice(4,8) as LIGTH_TYPE_KEY
        const count = Number(process.env.LIGHT_COUNT ?? 0);
        for(let i = 1;  i <= count; i++) {
            {
                const topic = `kocom/livingroom_light${i}/state`
                const payload = {
                    state: status.Light[`room${i}` as keyof typeof status.Light] ? 'ON' : 'OFF'
                }
                this.mqtt.publish(topic, payload)
            }
        }
    }

    createMessage(status: {room1: boolean, room2: boolean}){
        const msg = `30bc000e00010000${status.room1?'ff':'00'}${status.room2?'ff':'00'}000000000000`
        return `aa55${msg}${CheckSum(msg)}0d0d`
    }

    publish(){
        const count = Number(process.env.LIGHT_COUNT ?? 0);
        for(let i = 1;  i <= count; i++) {
            {
                const topic = `homeassistant/light/livingroom_light0${i}/config`
                const payload = {
                    "name": "kocom/livingroom",
                    "uniq_id": `livingroom_light0${i}}`,
                    "cmd_t": `kocom/livingroom_light${i}/set`,
                    "stat_t": `kocom/livingroom_light${i}/state`,
                    "schema": "json",
                    "brightness": false
                }
                this.mqtt.publish(topic, payload)
            }
        }
    }
}