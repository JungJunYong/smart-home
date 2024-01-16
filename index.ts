import net from 'net';
import receiveMsg from "./src/kocom/receiveMsg";

const sock = new net.Socket();
const server = net.createServer(function(client){
    client.on('data', function(data){
        console.log(client.remoteAddress, client.remotePort, data.toString('hex'))
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
});

server.listen(9999, function() {})
global.kocom = {socket: sock};

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
    var kocom: {socket: net.Socket}
}
