"use client";
import { RoomManager } from "@/app/_lib/room.services";
import ShareButton from "@/components/shareButton";
import User from "@/components/User";
import { MicIcon, MicOff, VideoIcon, VideoOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ImPhoneHangUp } from "react-icons/im";

export default function Room({ params }: { params: { roomId: string } }) {
  const roomURL = process.env.NEXT_PUBLIC_URL + "/room/" + params.roomId;
  const roomId = params.roomId;
  const user = useSession().data?.user;
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [cameraState, setCameraState] = useState<true | false>(false);
  const [micState, setMicState] = useState<true | false>(false);

  async function toggleCamera() {
    let videoTrack = stream
      ?.getTracks()
      .find((track) => track.kind === "video");
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraState(videoTrack.enabled);
    }
  }
  async function toggleMic() {
    let micTrack = stream?.getTracks().find((track) => track.kind === "audio");
    if (micTrack) {
      micTrack.enabled = !micTrack.enabled;
      setMicState(micTrack.enabled);
    }
  }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        //   {
        //   width: {min: 640, ideal: 1920, max: 1920},
        //   height: {min: 400, ideal: 1080, max: 1080},
        // },
        audio: true,
      })
      .then((stream) => {
        const roomManager = new RoomManager(roomId, stream);
        roomManager.createRoom();
        setStream(roomManager.localStream);
      });
  }, []);
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <main className="flex flex-row items-center justify-center flex-1 w-full h-full flex-wrap gap-3 p-2 bg-gray-900 text-white">
        <User name="khair" cameraOn={cameraState} stream={stream} />
        <User name="kha" />
      </main>

      <div className="p-4 bg-gray-800">
        <div className="flex items-center">
          <div className="flex-none">
            <p>{roomId}</p>
          </div>
          <div className="flex-1 space-x-4 flex justify-center">
            <button
              onClick={() => toggleMic()}
              className="p-3 rounded-full text-white bg-gray-700"
            >
              {micState ? (
                <MicIcon className="h-6 w-6" />
              ) : (
                <MicOff className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={() => toggleCamera()}
              className="p-3 rounded-full text-white bg-gray-700"
            >
              {cameraState ? (
                <VideoIcon className="h-6 w-6" />
              ) : (
                <VideoOff className="h-6 w-6" />
              )}
            </button>
            <button className="p-3 rounded-full bg-red-600">
              <ImPhoneHangUp className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-none justify-end">
            <ShareButton roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
}
