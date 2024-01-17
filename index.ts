import receiveMsg from "./src/kocom/receiveMsg";
import net from "net";


const clients: net.Socket[] = [];

const server = net.createServer(function(client){
    console.log('new Connection',client.remoteAddress,client.localAddress);
    if(!global.kocom && client.remoteAddress == '::ffff:14.39.64.167'){
        global.kocom = client;
    }
    clients.push(client);
    client.on('end', function(){
      console.log('연결 종료!!',client.remoteAddress);
        const index = clients.indexOf(client);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    })
    let chunk: string = '';
    let timer: NodeJS.Timeout;
    client.on('data', function(data){
        chunk += data.toString('hex')
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            broadcast(chunk, client);
            const msgList = extractAllBetweenCharacters(chunk, 'aa55', '0d0d');
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
        },500)
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

function broadcast(message: string, sender: net.Socket) {
    console.log(clients)
    clients.forEach((client) => {
        if (client !== sender) {
            console.log('send',message)
            client.write(message, 'hex');
        }
    });
}


declare global {
    var kocom: net.Socket | undefined;
}
