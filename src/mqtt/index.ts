import mqtt from 'mqtt'
import dotenv from 'dotenv';

dotenv.config();

export class Mqtt {
    client: mqtt.MqttClient;
    private static instance: Mqtt;

    constructor() {
        this.client = mqtt.connect('mqtt://' + (process.env.MQTT_HOST as string), {
            clientId: 'Kocom',
            protocol: 'mqtt',
            host: process.env.MQTT_HOST,
            port: Number(process.env.MQTT_PORT),
            username: process.env.MQTT_ID,
            password: process.env.MQTT_PW
        });
        this.client.on('connect', () => {
            this.client.subscribe('kocom/#');
        })
    }

    public onMessage(callback: (topic: string, message: string) => void) {
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