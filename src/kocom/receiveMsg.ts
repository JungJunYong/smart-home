import Light from "./device/Light";
import Gas from "./device/Gas";
import Thermo from "./device/Thermo";
import Fan from "./device/Fan";

export enum MSG_DEVICE_TYPE {
    전등 = '0e',
    가스 = '2c',
    thermo = '36',
    ac = '39',
    plug = '3b',
    엘리베이터 = '44',
    팬 = '48',
}
const deviceInstance= new Map([
    [MSG_DEVICE_TYPE.전등, new Light()],
    [MSG_DEVICE_TYPE.가스, new Gas()],
    [MSG_DEVICE_TYPE.thermo, new Thermo()],
    [MSG_DEVICE_TYPE.팬, new Fan()],
])


export function identifyDeviceType(msg: string) {
    const deviceCode = msg.slice(10, 12)
    console.log('msg 들어옴!')
    const deviceIntance = deviceInstance.get(deviceCode as MSG_DEVICE_TYPE);
    if(deviceIntance){
        deviceIntance.receiveMsg(msg)
    }else{
        console.log('정의된 메시지가 없습니다.',msg)
    }


}

export default function receiveMsg(msg: string) {
    identifyDeviceType(msg)
}