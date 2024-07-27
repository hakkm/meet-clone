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

class RoomManager {
  peerConnection: RTCPeerConnection;
  localStream: MediaStream;
  remoteStream: MediaStream;
  roomId: string;
  roomRef: DocumentReference;
  callerCandidatesCollectionRef: CollectionReference;

  constructor(roomId: string) {
    this.localStream = new MediaStream();
    this.remoteStream = new MediaStream();
    this.roomId = roomId;
    this.peerConnection = new RTCPeerConnection(configuration);
    this.roomRef = doc(db, "rooms", this.roomId);
    this.callerCandidatesCollectionRef = collection(this.roomRef, "callerCandidates");

    this.registerPeerConnectionListeners();
  }

  async createRoom() {
    console.log("Create PeerConnection with configuration: ", configuration);
    this.peerConnection = new RTCPeerConnection(configuration);

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.addEventListener("icecandidate", async (event) => {
      if (!event.candidate) {
        console.log("Got final candidate!");
        return;
      }
      console.log("Got candidate: ", event.candidate);
      await addDoc(this.callerCandidatesCollectionRef, event.candidate.toJSON());
    });

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    console.log("Created offer:", offer);

    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await setDoc(this.roomRef, roomWithOffer);
    this.roomId = this.roomRef.id;
    console.log(`New room created with SDP offer. Room ID: ${this.roomRef.id}`);

    this.peerConnection.addEventListener("track", (event) => {
      console.log("Got remote track:", event.streams[0]);
      event.streams[0].getTracks().forEach((track) => {
        console.log("Add a track to the remoteStream:", track);
        this.remoteStream.addTrack(track);
      });
    });

    onSnapshot(this.roomRef, async (snapshot) => {
      console.log("Got updated room:");
      const data = snapshot.data();
      if (!this.peerConnection.currentRemoteDescription && data && data.answer) {
        console.log("Got remote description: ", data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await this.peerConnection.setRemoteDescription(rtcSessionDescription);
      }
    });

    onSnapshot(collection(this.roomRef, "calleeCandidates"), (snapshot) => {
      console.log("calleeCandidates snapshot: ");
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }

  registerPeerConnectionListeners() {
    this.peerConnection.addEventListener("icegatheringstatechange", () => {
      console.log(`ICE gathering state changed: ${this.peerConnection.iceGatheringState}`);
    });

    this.peerConnection.addEventListener("connectionstatechange", () => {
      console.log(`Connection state change: ${this.peerConnection.connectionState}`);
    });

    this.peerConnection.addEventListener("signalingstatechange", () => {
      console.log(`Signaling state change: ${this.peerConnection.signalingState}`);
    });

    this.peerConnection.addEventListener("iceconnectionstatechange", () => {
      console.log(`ICE connection state change: ${this.peerConnection.iceConnectionState}`);
    });
  }
}

export default RoomManager;
