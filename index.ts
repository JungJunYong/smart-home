import receiveMsg from "./src/kocom/receiveMsg";
import net from "net";
import dotenv from "dotenv";

dotenv.config();

// 연결할 서버 정보
const serverHost = process.env.SERVER_HOST as string; // 서버 호스트
const serverPort = Number(process.env.SERVER_PORT); // 서버 포트

global.kocom = net.createConnection({host: serverHost, port: Number(serverPort)}, () => {
  console.log('connected to server!');
})

global.kocom.on('data', (data) => {
    const msgList = extractAllBetweenCharacters(data.toString('hex'), 'aa55', '0d0d');
    msgList.forEach((msg) => {
        const msgType = getMsgType(msg)
        switch (MSG_TYPE[msgType as unknown as keyof typeof MSG_TYPE]) {
            case '송신':
                receiveMsg(msg)
                break;
            default:
                console.log('알수없는패킷',msg)
        }
    })
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
