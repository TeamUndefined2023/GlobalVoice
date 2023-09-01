import React, { useCallback, useEffect, useState, useRef } from "react";
import Webcam from "react-webcam"; //npm install react-webcam
import "../styles/main.css";
import img from "../assets/chatbox.png";
import peer from "../service/peer";
import sound from "../assets/sound.png";
import send from "../assets/send.png";
import call from "../assets/call.png";
import { useAuth0 } from "@auth0/auth0-react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import offCall from "../assets/offCall.png";
import gm1 from "../assets/gmeet.png";
import gm2 from "../assets/gmeet1.png";
import gm3 from "../assets/gmeet2.png";
import {drawRect} from "../service/utils"; 

// import * as ml5 from "ml5";
import * as tf from "@tensorflow/tfjs";

const modelPath = `${process.env.REACT_APP_URL}/mainKNN1.json`

const Main = ({ userName }) => {
  // const [projectName,setProjectName]=useState('myprojectName');
  const webCamRef = React.useRef(null);
  const canvasRef = useRef(null);

  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [message, setMessage] = useState("hello")
  const [messages, setMessages] = useState([])

  const [prediction, setPrediction] = useState(null);

  const runCoco = async () => {
    // 3. TODO - Load network 
    // e.g. const net = await cocossd.load();
    // https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json
    const net = await tf.loadGraphModel('https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json')
    console.log('net', net);
    
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 16.7);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webCamRef.current !== "undefined" &&
      webCamRef.current !== null &&
      webCamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webCamRef.current.video;
      const videoWidth = webCamRef.current.video.videoWidth;
      const videoHeight = webCamRef.current.video.videoHeight;

      // Set video width
      webCamRef.current.video.width = videoWidth;
      webCamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640,480])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded)
      console.log(obj)

      const boxes = await obj[1].array()
      const classes = await obj[2].array()
      const scores = await obj[4].array()
      
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)  
      requestAnimationFrame(()=>{drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx)}); 

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)

    }
  };

  useEffect(()=>{runCoco()},[]);


  // Load KNN model once on component mount
  // useEffect(() => {
  //   let classifier = ml5.KNNClassifier();

  //   // Load the model (assuming knn.json is in public folder)
  //   classifier.load(modelPath, function() {
  //     console.log('KNN Model Loaded!');
  //   });

  //   // Set an interval to capture video frames and predict
  //   const predictInterval = setInterval(() => {
  //     if (webCamRef.current) {
  //       const video = webCamRef.current.video;
  //       if (video.readyState === 4) {
  //         classifier.classify(video, (error, result) => {
  //           if (error) {
  //             console.error(error);
  //             return;
  //           }
  //           setPrediction(result.label);
  //         });
  //       }
  //     }
  //   }, 1000); // Predict every 1 second

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(predictInterval);
  // }, []);

  useEffect(() => {
      
      // Set an interval to capture video frames and predict
      const sendMsg = setInterval(() => {
        socket.emit("message", {
          text: message, 
          // name: localStorage.getItem("userName"), 
          id: `${remoteSocketId}${Math.random()}`,
          socketID: remoteSocketId
          })
        
      }, 2000); // Predict every 1 second
  
      // Cleanup interval on component unmount
      return () => clearInterval(sendMsg);
    }, [socket]);

    useEffect(()=> {
      socket.on("messageResponse", data => setMessages([...messages, data]))
    }, [socket, messages])


  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <div id="bg">
      <div className="body">
        <div className="left">
          <div className="videobig">
            {/* <Webcam  className="userCam" audio={true} ref={webCamRef} mirrored={true}/> */}
            {remoteStream && (
              <>
                <ReactPlayer
                  playing
                  muted
                  height="100%"
                  width="100%"
                  url={remoteStream}
                />
              </>
            )}
            <div className="videosmall">
              {myStream && (
                <>
                  <ReactPlayer
                    playing
                    muted
                    height="100%"
                    width="100%"
                    url={myStream}
                  />
                </>
              )}
            </div>
          </div>
          {/* <div className="subtitle">
              <div className="sound"><img src={sound} alt="notfound" /></div><span className="text">Subtitles..</span>
            </div> */}
        </div>
        <div className="right">
          <div className="heading">
            <div className="title">
              <span>Welcome {userName}</span>
            </div>
            {/* <div className="time">
              <div className="circle"></div>
              <span>5</span>
            </div> */}
            <div className="leave">
            {(myStream)? <button className="sendStream" onClick={sendStreams}>Send Stream</button> :<button className="offSendStream" >Send Stream</button> }
            {(remoteSocketId)? <button className="call"   onClick={handleCallUser}><img src={call} alt="call" id="call" /></button> :<button className="offCall" ><img src={offCall} alt="call" id="offCall" /></button>}
            </div>
          </div>
          <div className="participants">
            <div className="p"><img src={gm1} alt="no participants" /></div>
            <div className="p"><img src={gm2} alt="no participants" /></div>
            <div className="p"><img src={gm3} alt="no participants" /></div>
          </div>
          <div>{JSON.stringify(messages)}</div>
        </div>
      </div>
    </div>
  );
};

export default Main;

