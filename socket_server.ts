import net from "net";


const clients: net.Socket[] = [];
let timer: NodeJS.Timeout | undefined;
let chunk: string = '';
const server = net.createServer(function(client) {
    console.log('신규 접속!!',client.remoteAddress);
    clients.push(client);
    client.on('data', function(data){
        chunk += data.toString('hex')
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            broadcast(chunk, client);
            chunk = '';
        },30)
    })

    client.on('end', function(){
        console.log('연결 종료!!',client.remoteAddress);
        const index = clients.indexOf(client);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    })
})

function broadcast(message: string, sender: net.Socket) {
    clients.forEach((client) => {
        if (client !== sender) {
            console.log('send',message)
            client.write(message, 'hex');
        }
    });
}


server.listen(9999, function() {})