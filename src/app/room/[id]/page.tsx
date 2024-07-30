'use client'
import { useEffect, useRef, useState } from "react"
import { HiVideoCamera, HiVideoCameraSlash} from "react-icons/hi2";
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import Pending from "@/components/room-meeting/Pending";


const Meet = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ height, setHeight ] = useState(0);
  const [ loaded, setLoaded] = useState(false);
  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 320,
            height: 180,
            facingMode: 'user',
            aspectRatio: 16/9
          },
          audio: true,
        });
        setStream(mediaStream);
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getMediaStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  useEffect(() => {
    if(videoRef.current){
      setHeight(videoRef.current.clientHeight)
    }
  })
  useEffect(() => {
  },[])
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
useEffect(() => {
  if(!stream?.getAudioTracks()){
    handleMute();
  }
},[stream])
  const handleCameraClick = () => {
    console.log("hello world")
    console.log(stream)
    !muted}
  

  const handleResize = () => {
    if(videoRef.current){
      setHeight(videoRef.current.clientHeight);
      console.log("hello")
    }
 }

  useEffect(() => {
    console.log('useEffect run')
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  },[videoRef])

  const handleCameraOn = async() => {
    console.log(paused)
    if(stream?.getVideoTracks){
    const [track] = stream.getVideoTracks();
    track.stop()
    setPaused(true);
  }}
  const handleCameraOff = async() => {
   try {
    console.log(paused)  
    console.log(loaded)
    setLoaded(true);
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 320,
        height: 180,
        facingMode: 'user',
        aspectRatio: 16/9
      },
      audio: muted ? false : true 
    });
    if(videoRef.current) videoRef.current.srcObject = mediaStream;
    setStream(mediaStream);
    setPaused(false)
    setLoaded(false)
   } catch (error) {
    console.log(error) 
   } 
  }
  const handleMute = () => {
    const tracks = stream?.getAudioTracks()
    console.log(tracks)
    if(tracks){
      console.log(tracks[0])
      tracks[0].stop()
      setMuted(true)
    }
  }
  const handleUnmute = async() => {
    
    try {

      const constraint = {
        video: {
          width: 320,
          height: 180,
          facingMode: 'user',
          aspectRatio: 16/9
        },
        audio: true

      } 
      const mediaStream = await navigator.mediaDevices.getUserMedia(paused ? {audio:true}:constraint);
      if(videoRef.current && paused) videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setMuted(false)        

    } catch (error) {
      
    }
    
  }
  return (

    <section className="flex px-[3rem] items-center mt-[4rem] justify-around flex-col lg:flex-row md:justify-between ">
      <div className="relative w-full h-[25rem]  shadow-inset-lg mt-[5rem] border-black lg:w-1/2 ">
        <h1 className=" text-center absolute z-30 top-0 left-0 transform  text-white ml-[0.5rem]">
          Name
        </h1>
        <div className="flex bg-transparent w-[8rem] absolute bottom-0 left-1/2 -translate-x-1/2 z-[999] justify-around items-center ">
            {!paused ? (
              <Button className="bg-transparent hover:bg-transparent">
                <HiVideoCamera className="text-white size-[2rem]" onClick={handleCameraOn}/>
              </Button>
            ):(
              <Button className="bg-transparent hover:bg-transparent" disabled={loaded}>
                <HiVideoCameraSlash className="text-white size-[2rem]" onClick={handleCameraOff}/>
              </Button>
            )}

            {!muted ? (
              <Button className="bg-transparent hover:bg-transparent">
                <BiSolidMicrophone className="text-white size-[2rem]" onClick={handleMute}/>
              </Button>
            ):(
              <Button className="bg-transparent hover:bg-transparent">
                <BiSolidMicrophoneOff className="text-white size-[2rem]" onClick={handleUnmute}/>
              </Button>
            )}

          
        </div>
        <div style={{height: height + 'px'}} className={`h-[${height+'px'}] absolute top-0 z-50 w-full rounded-md bg-transparent shadow-lg shadow-black`}>

          
        </div>

        <video 
          ref={videoRef} 
          autoPlay 
           
          playsInline
          className="w-full bg-black h-auto rounded-md absolute top-0 left-0 object-cover shadow-inset-lg lg:h-full outline-8 outline-gray-950 "
        />
      </div>
      <div>
            <div className="flex flex-col justify-start items-center">
              <h1 className="text-3xl text-center mb-3">
                Room Pending, Wanna get in?
              </h1>
              <div className="relative mb-5">
                <span>Participants</span>
                {/* here we will list participants */}
              </div>
              <div className="flex justify-around w-full mt-4">
                <Button className="bg-blue-600 w-3/12 text-xl">
                  Participate
                </Button>
                <Button className="bg-transparent border w-3/12 text-xl border-blue-500 text-blue-500">
                  Back 
                </Button>
              </div> 
            </div>
      </div>
    </section>
  );
};

export default Meet;