const si = require('systeminformation');
const Moment = require('jalali-moment');

class SystemInfo{
    constructor(params) {
        
    };



    async getInfo(){

        let cpuData = await this.getCpuInfo()
        let networkData = await this.getNetworkInfo();
        let memoryData = await this.getMemory();
        let storageData = await this.getStorage();
        return{
            cpu : cpuData,
            network : networkData,
            memory : memoryData,
            storage : storageData,
            time : Moment().format('jYYYY/jMM/jDD HH:mm:ss'),
        }
    }

    async getCpuInfo(){
        let cpu = await si.currentLoad();

        cpu = {
            core : cpu.cpus.map(item=>{
                return{
                    load : item.load
                }
            }),
            currentload : parseFloat(cpu.currentload.toFixed(2)),
            loadAvrage : cpu.avgload
        }

        return cpu
    }

    async getNetworkInfo(){
        let network = await si.networkStats(await si.networkInterfaceDefault());
        network = {
            rx : parseFloat((network[0].rx_sec/1048576).toFixed(3)),
            tx : parseFloat((network[0].tx_sec/1048576).toFixed(3)),
        }
        return network
    }

    async getMemory(){
        let memory = await si.mem()
        memory = {
            total : parseFloat((memory.total/1073741824).toFixed(2)),
            available : parseFloat((memory.available/1073741824).toFixed(2)),
            active : parseFloat((memory.active/1073741824).toFixed(2))
        }
        return memory
    }

    async getStorage(){
        let storage = await si.fsSize();

        storage = storage.map(item=>{

            return{
                mount : item.mount,
                size : parseFloat((item.size/1073741824).toFixed(2)),
                used : parseFloat((item.used/1073741824).toFixed(2)),
                use_percent : item.use
            }
        })

        return storage
    }

}


module.exports = SystemInfo