import DeviceIf from "./DeviceIf";
import {Mqtt} from "../../mqtt";

export default class Elevator implements DeviceIf {
    constructor() {
        this.mqtt = Mqtt.getInstance();
        if(!this.mqtt.client.connected){
            this.mqtt.client.on('connect', () => {
                if(this.count === 0) {
                    this.publish();
                    this.count++;
                }

            })
        }
    }
    count = 0;

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
        if(msg.toLowerCase() === '30bc004400010000030000000000000034'){
            this.mqtt.publish('kocom/share_elevator/state', {state: 'OFF'})
            this.mqtt.publish('kocom/share_elevator/status', {status: 'NONE'})
        }else if(msg.includes('0x0050')){
            const msgList = msg.split(" ");
            if(msgList.length === 9 && msgList[5] !== "0100"){
                const hex = msgList[3].match(/.{2}/g)?.join()!;
                const floor = this.parseFloorCode(hex);
                console.log('엘리베이터 층:', floor);
                this.mqtt.publish('kocom/share_elevator/status', {status: floor});
            }
        }
    }

    parseFloorCode(hex: string): string {
        const buffer: Buffer = Buffer.from(hex, 'hex');
        const ascii: string = buffer.toString('ascii').replace(/\u0000/g, '');

        // 'B' + 숫자 → 지하층 처리
        if (ascii.length === 2 && ascii[0] === 'B' && /^\d$/.test(ascii[1])) {
            return `${ascii[1]}층`;
        }

        // 순수 숫자 → 숫자층 처리
        if (/^\d+$/.test(ascii)) {
            return `${ascii}층`;
        }

        // 알파벳 2글자 (예: 'LB') → 그대로 표기
        if (/^[A-Z]{2}$/i.test(ascii)) {
            return `${ascii}층`;
        }

        return '알 수 없음';
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
        this.mqtt.publish(`homeassistant/sensor/share_elevator_status/config`, {
            "name": "kocom/elevator_status",
            "uniq_id": `elevator_status`,
            "stat_t": `kocom/share_elevator/status`,
            "value_template":"{{ value_json.status}}",
            "schema": "json",
        });

        console.log('elevator publish complete');
    }
}