import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./app.css";

const socket = io.connect('http://localhost:5000');

function Home() 
{
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => 
    {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      myVideo.current.srcObject = stream;
    });
    socket.on("me", (id) => {
      setMe(id);
    });
      socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });}, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex justify-center mb-4">
          {stream && (
            <video
              id="my-video"
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-60"
            />
          )}
        </div>
        <div className="flex justify-center">
          <div className="w-60">
            {callAccepted && !callEnded ? (
              <video
                id="video"
                playsInline
                ref={userVideo}
                autoPlay
                className="w-full"
              />
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <div className="myId flex items-center space-x-2">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-2 py-1 border rounded"
            />
            <CopyToClipboard text={me}>
              <button className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700">
                Copy ID
              </button>
            </CopyToClipboard>
            <input
              type="text"
              placeholder="ID to call"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
              className="px-2 py-1 border rounded"
            />
            <div className="call-button space-x-2">
              {callAccepted && !callEnded ? (
                <button
                  onClick={leaveCall}
                  className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-700"
                >
                  End Call
                </button>
              ) : (
                <button
                  onClick={() => callUser(idToCall)}
                  className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-700"
                >
                  Call
                </button>
              )}
            </div>
          </div>
          {receivingCall && !callAccepted ? (
            <div className="caller flex items-center space-x-2">
              <h1>{name} is calling...</h1>
              <button
                onClick={answerCall}
                className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
              >
                Answer
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
  
  
}



export default Home;
