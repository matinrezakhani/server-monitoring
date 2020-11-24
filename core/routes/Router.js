const { monitoring_interval_time } = require('../config')
const SystemInfo = require('./../controllers/SytstemInfo')

const systemInfo = new SystemInfo()

module.exports = (app , io)=>{

    app.prefix('/api' , api=>{
        api.get('/create-admin-user' , (req , res) =>{
            res.status(200).json('ok')
        })
        

    })


    let interval;
    io.on("connection" , (socket)=>{

        console.log('new user connect');

        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval( async () => {
            let data = await systemInfo.getInfo();
            socket.emit('system-info' , data)
        }, monitoring_interval_time);

        socket.on("disconnect", () => {
            console.log("Client disconnected");
            clearInterval(interval);
        });

    })
}