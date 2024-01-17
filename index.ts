import receiveMsg from "./src/kocom/receiveMsg";
import net from "net";




const server = net.createServer(function(client){
    console.log('new Connection',client.remoteAddress);
    client.setNoDelay(true)
    client.on('end', function(){
      console.log('연결 종료!!',client.remoteAddress);
    })
    let chunk: string = '';
    let timer: NodeJS.Timeout;
    client.on('data', function(data){
        console.log(data.toString('hex'),client.remoteAddress);
        chunk += data.toString('hex')
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            const msgList = extractAllBetweenCharacters(chunk, 'aa55', '0d0d');
            console.log(msgList)
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
            chunk = '';
        },10)
    })
});

server.listen(9999, function() {})

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
    var kocom: net.Socket;
}
