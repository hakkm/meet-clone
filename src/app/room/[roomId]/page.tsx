"use client";
import ShareButton from "@/components/shareButton";
import {
  MicIcon,
  VideoIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { ImPhoneHangUp } from "react-icons/im";

export default function Room({ params }: { params: { roomId: string } }) {
  const roomURL = process.env.NEXT_PUBLIC_URL + "/room/" + params.roomId;
  const roomId = params.roomId;
  const user = useSession().data?.user;
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <main className="flex flex-col items-center justify-center flex-1">
        <div className="w-32 h-32 mb-8 rounded-full overflow-hidden bg-gray-700">
          <div className="flex items-center justify-center h-full w-full text-6xl font-bold">
            {user?.name![0].toUpperCase()}
          </div>
        </div>
        <p className="mb-4">{user?.name!}</p>

      </main>
      <div className="p-4 bg-gray-800">
        <div className="flex items-center">
          <div className="flex-none">
            <p>{roomId}</p>
          </div>
          <div className="flex-1 space-x-4 flex justify-center">
            <button className="p-3 rounded-full text-white bg-gray-700">
              <MicIcon className="h-6 w-6" />
            </button>
            <button className="p-3 rounded-full text-white bg-gray-700">
              <VideoIcon className="h-6 w-6" />
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
