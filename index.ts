import { createServer } from "http";
import { Server } from "socket.io";
import receiveMsg from "./src/kocom/receiveMsg";
import * as buffer from "buffer";

const httpServer = createServer();
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  console.log("a user connected");
})

io.on('data', function(data: Buffer){
    console.log('data',data)
})

httpServer.listen(9999);


// const server = net.createServer(function(client){
//     client.on('data', function(data){
//         if(client.remoteAddress == '::ffff:14.39.64.167' && !global.kocom){
//             global.kocom = client;
//             const msgList = extractAllBetweenCharacters(data.toString('hex'), 'aa55', '0d0d');
//             msgList.forEach((msg) => {
//                 const msgType = getMsgType(msg)
//                 switch (MSG_TYPE[msgType as unknown as keyof typeof MSG_TYPE]) {
//                     case '송신':
//                         receiveMsg(msg)
//                         break;
//                     default:
//                         console.log('알수없는패킷',msg)
//                 }
//             })
//         }else if(client.remoteAddress != client.localAddress){
//             global.kocom.emit('data',data)
//         }
//     })
// });
//
// server.listen(9999, function() {})
//
// export enum MSG_TYPE {
//     '30b' = '송신',
//     '30d' = '수신'
// }
//
//
// function getMsgType(msg: string): MSG_TYPE {
//     return msg.slice(0, 3) as MSG_TYPE
// }
//
//
// function extractAllBetweenCharacters(inputString: string, startChar: string, endChar: string): string[] {
//     const regexPattern = new RegExp(`${startChar}(.*?)${endChar}`, 'g');
//     const matches = [];
//     let match;
//
//     while ((match = regexPattern.exec(inputString)) !== null) {
//         matches.push(match[1]);
//     }
//     return matches.length > 0 ? matches : [];
// }


declare global {
    var kocom: any
}
