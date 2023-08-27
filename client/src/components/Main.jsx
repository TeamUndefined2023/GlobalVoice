import React, { useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";   //npm install react-webcam
import "../styles/main.css";
import img from '../assets/chatbox.png';
import peer from "../service/peer";
import sound from "../assets/sound.png";
import send from "../assets/send.png";
import { useAuth0 } from "@auth0/auth0-react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from 'react-player';

const Main = ({userName}) => {
  // const [projectName,setProjectName]=useState('myprojectName');
  const webCamRef=React.useRef(null);
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

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
      <div className="heading">
        <div className="title">
          <span>Welcome {userName}</span>
        </div>
        {/* <div className="time">
          <div className="circle"></div>
          <span>5</span>
        </div> */}
        <div className="leave">
        {myStream && <button className="sendStream" onClick={sendStreams}>Send Stream</button>}
        {remoteSocketId && <button className="call"   onClick={handleCallUser}>CALL</button>}
        </div>
      </div>
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
                      height='100%'
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
            <h1 className="head">Chats</h1>
            <div className="oldchat"><img src={img} alt="nothing to show" /></div>
            <div className="curr_chat">
              <input placeholder="type a message" type="text" />
              <button className="send">
              <img src={send} alt="404 error" />
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Main;
