

const header = {
    aa55: '시작'
}
const trailer = {
    '0d0d': '끝'
}

const padding = {'00': '패딩'}
const dest = {'000e': 'LIGHT', '002c': 'GAS','0036':"THERMO",'0044':'ELEVATOR','0048':'FAN'}
const cmd = {'3c': '조회', '00': '응답 및 수정요청', '01':'on','02':'off'}

const getDest = (msg: string)=>{
    return dest[msg as keyof typeof dest]
}

const getSrc = (msg: string)=> {
    console.log('패킷 발송기기',msg)
}
const getCmd = (msg: string)=> {
    return cmd[msg as keyof typeof cmd]
}

const getValue = (msg: string)=> {
    return
}
