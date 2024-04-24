import DeviceIf from "./DeviceIf";
import {Mqtt} from "../../mqtt";

export default class Elevator implements DeviceIf {
    constructor() {
        this.mqtt = Mqtt.getInstance();
        if(!this.mqtt.client.connected){
            this.mqtt.client.on('connect', () => {
                this.publish();
            })
        }
    }
    mqtt: Mqtt;

    sendMsg(topic: string, sendMsg: string) {
        const callMessage = "aa5530bc0001004400010000000000000000320d0d";
        global.kocom?.write(Buffer.from(callMessage, 'hex'));
        this.mqtt.publish('kocom/share_elevator/state', {state: 'ON'})
    }

    searchMsg(msg: string) {
        console.log("receiveMsg");
    }

    receiveMsg(msg: string) {
        console.log("receiveMsg",msg);
        if(msg.toLowerCase() === '30bc004400010000030000000000000034'){
            this.mqtt.publish('kocom/share_elevator/state', {state: 'OFF'})
        }
    }

    publish() {
        const topic = `homeassistant/light/share_elevator/config`
        const payload = {
            "name": "kocom/elevator",
            "uniq_id": `elevator`,
            "cmd_t": `kocom/share_elevator/set`,
            "stat_t": `kocom/share_elevator/state`,
            "schema": "json",
        }
        this.mqtt.publish(topic, payload)
    }
}