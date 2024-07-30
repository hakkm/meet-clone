import db from "@/lib/firestore";
import { configuration } from "@/lib/rtcPeerConConfig";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  DocumentReference,
  CollectionReference,
} from "firebase/firestore";

export class RoomManager {
  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  roomId: string;
  roomRef: DocumentReference;
  callerCandidatesCollectionRef: CollectionReference;

  constructor(roomId: string, stream: MediaStream | undefined) {
    if (!stream) throw new Error("Stream is undefied")
    this.localStream = stream;
    this.remoteStream = new MediaStream();
    this.roomId = roomId;
    this.roomRef = doc(db, "rooms", this.roomId);
    this.callerCandidatesCollectionRef = collection(
      this.roomRef,
      "callerCandidates",
    );
  }

  async createRoom() {
    console.log("Create PeerConnection with configuration: ", configuration);
    let peerConnection = new RTCPeerConnection(configuration);
    this.registerPeerConnectionListeners(peerConnection);

    this.localStream!.getTracks().forEach((track) => {
      peerConnection.addTrack(track, this.localStream!);
    });

    peerConnection.onicecandidate = async (event) => {
      console.log("Got new local ICE candidate: ", event.candidate);
      if (!event.candidate) {
        console.log("Got final candidate!");
        return;
      }
      console.log("Got candidate: ", event.candidate);
      await addDoc(
        this.callerCandidatesCollectionRef,
        event.candidate.toJSON(),
      );
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("Created offer:", offer);
    console.log({ peerConnection });

    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await setDoc(this.roomRef, roomWithOffer);
    this.roomId = this.roomRef.id;
    console.log(`New room created with SDP offer. Room ID: ${this.roomRef.id}`);

    peerConnection.addEventListener("track", (event) => {
      console.log("Got remote track:", event.streams[0]);
      event.streams[0].getTracks().forEach((track) => {
        console.log("Add a track to the remoteStream:", track);
        this.remoteStream.addTrack(track);
      });
    });

    onSnapshot(this.roomRef, async (snapshot) => {
      console.log("Got updated room:");
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        console.log("Got remote description: ", data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(rtcSessionDescription);
      }
    });

    onSnapshot(collection(this.roomRef, "calleeCandidates"), (snapshot) => {
      console.log("calleeCandidates snapshot: ");
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }

  registerPeerConnectionListeners(peerConnection: RTCPeerConnection) {
    peerConnection.addEventListener("icegatheringstatechange", () => {
      console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`,
      );
    });

    peerConnection.addEventListener("connectionstatechange", () => {
      console.log(`Connection state change: ${peerConnection.connectionState}`);
    });

    peerConnection.addEventListener("signalingstatechange", () => {
      console.log(`Signaling state change: ${peerConnection.signalingState}`);
    });

    peerConnection.addEventListener("iceconnectionstatechange", () => {
      console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`,
      );
    });
  }
}

