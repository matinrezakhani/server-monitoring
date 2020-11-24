import React, { memo, useState } from 'react';
import { useEffect } from 'react';
import socketIOClient from "socket.io-client";
import './App.scss';
import { Typography , Row , Col} from 'antd';
import {  LineChart, Line, XAxis, YAxis, BarChart, Bar, Legend,ResponsiveContainer} from 'recharts'
import Moment from 'jalali-moment';


const {Text} = Typography


const socket = socketIOClient();


function App() {

  const max = 60
  
  const [newData , setNewData] = useState({
    memory : {},
    network : {},
    cpu : {},
    storage : []
  })

  const [lastReceiveTime , setLastReceiveTime] = useState('')

  const [networkData , setNetworkData] = useState([])
  const [memoryData , setMemoryData] = useState([])
  const [cpuData , setCpuData] = useState([])
  const [storageData , setStorageData] = useState([])
  


  useEffect(()=>{

    socket.on("system-info", data => {
      setLastReceiveTime(data.time);
      //console.log(data);

      setNewData(data)
      

    });

  },[])


  useEffect(()=>{
    getNetwork(newData)
    getMemory(newData)
    getCpu(newData)
    getStorage(newData)
  },[newData])

  const getNetwork = ({network})=>{

    if(!network) return;
    let data = [...networkData];

    if(data.length > max) data.splice(0 , 1)

    data.push({
      time : Moment().format('HH:mm:ss'),
      send : network.tx ,
      receive : network.rx 
    })

    setNetworkData(data)
  }

  const getMemory = ({memory})=>{

    if(!memory) return;
    let data = [...memoryData];

    if(data.length > max) data.splice(0 , 1)

    data.push({
      time : Moment().format('HH:mm:ss'),
      total : memory.total,
      active : memory.active ,
      available : memory.available
    })

    setMemoryData(data)
  }

  const getCpu = ({cpu})=>{

    if(!cpu) return;
    let data = [...cpuData];

    if(data.length > max) data.splice(0 , 1)

    data.push({
      time : Moment().format('HH:mm:ss'),
      load : cpu.currentload
    })

    setCpuData(data)
  }

  const getStorage = ({storage})=>{

    if(!storage) return;
    let data = storage.map(item=>{
     
      return(
        {
          mount : item.mount,
          use : item.use_percent
        }
      )
    })

    setStorageData(data)
  }




  

  


  
  return (
    <div className="app">
        <Row justify={'center'}>
          <Col>
              <Text className={'last-receive-time'}> Last Receive Data : {lastReceiveTime}</Text>
          </Col>
        </Row>

        <Row align={'middle'} justify={'space-around'}>

          <Col lg={{span : 11}} xs={{span : 24}}>

            <div className={'chart-box'}>

              <Text style={{color : '#fff'}}>NETWORK (MB Per Second)</Text>
              <br />
              <Text style={{color : '#fff'}}>receive : {newData.network.rx} MB/s</Text>
              <br />
              <Text style={{color : '#fff'}}>send : {newData.network.tx} MB/s</Text>
              <br />


              <ResponsiveContainer width={'100%'}  height={250}>

                <LineChart
                  data={networkData}
                  margin={{
                    top: 25, right: 5, left: 5, bottom: 10,
                  }}
                >
                  <XAxis dataKey="time" />
                  <YAxis domain={[0 , 1]} />
                  
                  <Legend />
                  <Line type="monotone" dataKey="receive" stroke="#f00"  dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="send" stroke="#0f0"  dot={false} isAnimationActive={false} />
                </LineChart>

              </ResponsiveContainer>
              
            </div>

          </Col>

          <Col lg={{span : 11}} xs={{span : 24}}>

            <div className={'chart-box'}>

              <Text style={{color : '#fff'}}>MEMORY (GB)</Text>
              <br />
              <Text style={{color : '#fff'}}>total : {newData.memory.total} GB</Text>
              <br />
              <Text style={{color : '#fff'}}>active : {newData.memory.active} GB</Text>
              <br />

              <ResponsiveContainer width={'100%'}  height={250}>
                <LineChart
                  
                  data={memoryData}
                  margin={{
                    top: 25, right: 5, left: 5, bottom: 10,
                  }}
                >
                  <XAxis dataKey="time" />
                  <YAxis domain={[0 , newData.memory.total]} />
                  
                  <Legend />
                  <Line type="natural" dataKey="active" stroke="#f00"  dot={false} isAnimationActive={false}  />
                  <Line type="monotone" dataKey="total" stroke="#0f0"  dot={false}  isAnimationActive={false}/>
                </LineChart>
              </ResponsiveContainer>
              
            </div>

          </Col>

          
        </Row>

        <br />
        <br />



        <Row align={'middle'} justify={'space-around'} >

          <Col lg={{span : 11}} xs={{span : 24}}>

            <div className={'chart-box'}>

              <Text style={{color : '#fff'}}>STORAGE (%)</Text>
              <br />
              {newData.storage.map(item=>{
                return(
                  <>
                    <Text style={{color : '#fff'}}>{item.mount} : {item.use_percent} %</Text>
                    <br />
                  </>
                )
              })}
              
           

              <ResponsiveContainer width={'100%'}  height={250}>
                <BarChart
                  width={700}
                  height={250}
                  data={storageData}
                  margin={{
                    top: 25, right: 5, left: 5, bottom: 10,
                  }}
                  barSize={20}
                >
                  <XAxis dataKey="mount"  />
                  <YAxis domain={[0 , 100]}/> 
                  
                  <Legend />
                  
                  <Bar 
                    
                    dataKey="use" 
                    fill={'#f00'} 
                    
                    background={{ fill: '#eee' }} barSize={100} isAnimationActive={false}  />
                </BarChart>
              </ResponsiveContainer>
              
                

            </div>

          </Col>

          <Col lg={{span : 11}} xs={{span : 24}}>

            <div className={'chart-box'}>

              <Text style={{color : '#fff'}}>CPU</Text>
              <br />
              <Text style={{color : '#fff'}}>current load : {newData.cpu.currentload} %</Text>
              <br />
              <Text style={{color : '#fff'}}>load avrage : {newData.cpu.loadAvrage} </Text>
              <br />
              

              <ResponsiveContainer width={'100%'}  height={250}>

                <LineChart
                  width={700}
                  height={250}
                  data={cpuData}
                  margin={{
                    top: 25, right: 5, left: 5, bottom: 10,
                  }}
                >
                  <XAxis dataKey="time" />
                  <YAxis domain={[0 , 100]} />
                  
                  <Legend />
                  <Line type="natural" dataKey="load" stroke="#f00"  dot={false} isAnimationActive={false} />
                  
                </LineChart>

              </ResponsiveContainer>
              
            </div>

          </Col>


        </Row>

        

    </div>
  );
}

export default App;
