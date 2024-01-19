import mqtt from 'mqtt'
import dotenv from 'dotenv';
dotenv.config();

export class Mqtt {
    client: mqtt.MqttClient;
    private static instance: Mqtt;
    constructor() {
        this.client = mqtt.connect('mqtt://'+(process.env.MQTT_HOST as string), {
            clientId: 'Kocom_WallPad',
            host: process.env.MQTT_HOST,
            port: Number(process.env.MQTT_PORT),
            username: process.env.MQTT_ID,
            password: process.env.MQTT_PW
        });


        this.client.on('connect', () => {
            console.log('mqtt connected');
            // this.client.on('message', function (topic, message) {
            //     console.log(topic, message.toString());
            // });
            this.client.subscribe('kocom/#');
            const topic = 'homeassistant/light/kitchen_light01/config'
            const payload = {
                "name": "kocom/Kitchen",
                "uniq_id": "kitchen_light01",
                "cmd_t": "kocom/kitchen_light1/set",
                "stat_t": "kocom/kitchen_light1/state",
                "schema": "json",
                "brightness": false
            }
            this.client.publish(topic, JSON.stringify(payload))

            const topic2 = 'homeassistant/light/kitchen_light02/config'
            const payload2 = {
                "name": "kocom/Kitchen",
                "uniq_id": "kitchen_light02",
                "cmd_t": "kocom/kitchen_light2/set",
                "stat_t": "kocom/kitchen_light2/state",
                "schema": "json",
                "brightness": false
            }
            this.client.publish(topic2, JSON.stringify(payload2))
            console.log('mqtt publish');
        })
    }

    public onMessage( callback: (topic: string, message: string) => void) {
        this.client.on('message', function (topic, message) {
            callback(topic, message.toString());
        });
    }

    public publish<T>(topic: string, payload: T) {
        this.client.publish(topic, JSON.stringify(payload))
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Mqtt();
        }
        return this.instance;
    }





}