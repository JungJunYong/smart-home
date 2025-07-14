import Light from "./device/Light";
import Gas from "./device/Gas";
import Thermo from "./device/Thermo";
import Fan from "./device/Fan";
import Elevator from "./device/Elevator";
import DeviceIf from "./device/DeviceIf";

 const MSG_TYPE =  {
    LIGHT : '0e',
    GAS :'2c',
    THERMO : '36',
    AC :'39',
    PLUG : '3b',
    ELEVATOR : '44',
    FAN : '48',
}

export enum MSG_DEVICE_TYPE {
    전등 = '0e',
    가스 = '2c',
    thermo = '36',
    ac = '39',
    plug = '3b',
    엘리베이터 = '44',
    팬 = '48',
}
const deviceInstance= new Map<MSG_DEVICE_TYPE, DeviceIf>([
    [MSG_DEVICE_TYPE.전등, new Light()],
    [MSG_DEVICE_TYPE.가스, new Gas()],
    [MSG_DEVICE_TYPE.thermo, new Thermo()],
    [MSG_DEVICE_TYPE.팬, new Fan()],
    [MSG_DEVICE_TYPE.엘리베이터, new Elevator()],
])


export function identifyDeviceType(msg: string) {
    const deviceCode = msg.slice(10, 12);
    const deviceCode2 = msg.slice(6,8);
    const device = deviceInstance.get(deviceCode as MSG_DEVICE_TYPE);
    const device2 = deviceInstance.get(deviceCode2 as MSG_DEVICE_TYPE);

    if(device){
        device.receiveMsg(msg)
    }else if(device2){
        device2.receiveMsg(msg)
    }else{
        console.log('정의된 메시지가 없습니다.',msg)
    }


}

export function receiveMsg(msg: string,type: "kocom" | "network" = 'kocom') {
     if(type === 'kocom'){
         identifyDeviceType(msg)
     }else{
       deviceInstance.get(MSG_DEVICE_TYPE.엘리베이터)?.receiveMsg(msg)
     }
}

export function receiveMqttMsg(topic: string, message: string) {
    const regex =  /\/([^\/]+)\//;
    const type = topic.match(regex)![1]!.split('_')[1];
    const _device = type?.replace(/\d/g,'').toUpperCase();
    const topiclist = topic.split('/')
    const messageType = topiclist.pop()
    const device = deviceInstance.get(MSG_TYPE[_device as keyof typeof MSG_TYPE] as MSG_DEVICE_TYPE);
    if(messageType === 'set'){
        device?.sendMsg(topic,message)
    }

}
