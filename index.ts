import {receiveMqttMsg, receiveMsg} from "./src/kocom/receiveMsg";
import net from "net";
import dotenv from "dotenv";
import {Mqtt} from "./src/mqtt";
import Elevator from "./src/kocom/device/Elevator";

dotenv.config();

// 연결할 서버 정보
const serverHost = process.env.SERVER_HOST as string; // 서버 호스트
const serverPort = Number(process.env.SERVER_PORT); // 서버 포트
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 60000;

function connectWithRetry(retryDelay = INITIAL_RETRY_DELAY) {
    global.kocom = net.createConnection({host: serverHost, port: Number(serverPort)}, () => {
        console.log(`Successfully connected to server at ${serverHost}:${serverPort}`);
    });

    global.kocom.on('error', (err) => {
        console.error('Connection error occurred:', err.message);
        console.error('Error details:', err);
    });

    global.kocom.on('close', () => {
        const nextDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
        console.log(`Connection closed. Attempting reconnection in ${retryDelay / 1000} seconds...`);
        setTimeout(() => connectWithRetry(nextDelay), retryDelay);
    });

    global.kocom.on('data', (data) => {
        try {
            const msgList = extractAllBetweenCharacters(data.toString('hex'), 'aa55', '0d0d');
            msgList.forEach((msg) => {
                const msgType = getMsgType(msg)
                console.log(MSG_TYPE[msgType as unknown as keyof typeof MSG_TYPE], msg)
                switch (MSG_TYPE[msgType as unknown as keyof typeof MSG_TYPE]) {
                    case '송신':
                        receiveMsg(msg, "kocom")
                        break;
                    case '수신':
                        receiveMsg(msg, "kocom")
                        break;
                    default:
                        console.log('Unknown packet received:', msg)
                }
            })
        } catch (error) {
            console.error('Error processing received data:', error);
        }
    });
}

connectWithRetry();

const mqtt = Mqtt.getInstance()
mqtt.onMessage((topic, message) => {
    if(topic.includes('kocom')){
        receiveMqttMsg(topic, message)
    }else if (topic.includes('network')){
        receiveMsg(message, 'network')
    }
})



export enum MSG_TYPE {
    '30b' = '송신',
    '30d' = '수신'
}


function getMsgType(msg: string): MSG_TYPE {
    return msg.slice(0, 3) as MSG_TYPE
}


function extractAllBetweenCharacters(inputString: string, startChar: string, endChar: string): string[] {
    const regexPattern = new RegExp(`${startChar}(.*?)${endChar}`, 'g');
    const matches = [];
    let match;

    while ((match = regexPattern.exec(inputString)) !== null) {
        matches.push(match[1]);
    }
    return matches.length > 0 ? matches : [];
}


declare global {
    var kocom: net.Socket | undefined;
}
