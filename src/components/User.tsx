"use client"
import type { User } from "@/app/_lib/definitions";
import React, { useEffect, useRef } from "react";

export default function User({
  name,
  stream,
}: {
  name: string;
  stream?: MediaStream;
}) {
  const refVideo = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (!refVideo.current || !stream) return
    refVideo.current.srcObject = stream
  }, [stream])
  return (
    <div>
      
    {stream ? (
        <video
          autoPlay
          playsInline
          ref={refVideo}
          className="flex-1"
        />
    ) : (

    <div className="flex flex-col items-center justify-center grow">
      <div className="flex flex-col items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white w-24 h-24 rounded-full m-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="text-4xl font-bold">{name![0].toUpperCase()}</div>
      </div>
      <div className="text-sm mt-2">{name}</div>
    </div>
    )}
    </div>
  );
}
