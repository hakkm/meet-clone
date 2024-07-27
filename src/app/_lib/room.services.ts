import db from "@/lib/firestore";
import { configuration } from "@/lib/rtcPeerConConfig";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

let peerConnection: RTCPeerConnection;
let localStream: MediaStream;
let remoteStream: MediaStream;
let roomDialog = null;
let roomId: string;

async function createRoom(
peerConnection: RTCPeerConnection,
localStream: MediaStream
) {
  // const roomRef = await db.collection("rooms").doc();
  const roomRef = doc(db, "rooms", roomId);

  console.log("Create PeerConnection with configuration: ", configuration);
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners();

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // create a subcollection associated with Document(roomRef)
  // const callerCandidatesCollection = roomRef.collection("callerCandidates");
  const callerCandidatesCollectionRef = collection(roomRef, "callerCandidates");

  peerConnection.addEventListener("icecandidate", async (event) => {
    if (!event.candidate) {
      console.log("Got final candidate!");
      return;
    }
    console.log("Got candidate: ", event.candidate);
    // add candidate as a document in the callerCandidates subcollection
    const candidateDocRef = await addDoc(
      callerCandidatesCollectionRef,
      event.candidate.toJSON(),
    );
  });
  // Code for collecting ICE candidates above

  // Code for creating a room below
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log("Created offer:", offer);

  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  // todo:
  await setDoc(roomRef, roomWithOffer);
  roomId = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
  // Code for creating a room above

  peerConnection.addEventListener("track", (event) => {
    console.log("Got remote track:", event.streams[0]);
    event.streams[0].getTracks().forEach((track) => {
      console.log("Add a track to the remoteStream:", track);
      remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description below
  onSnapshot(roomRef, async (snapshot) => {
    console.log("Got updated room:");
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data && data.answer) {
      console.log("Got remote description: ", data.answer);
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
  });
  // roomRef.onSnapshot(async (snapshot) => {
  //   console.log("Got updated room:");
  //   const data = snapshot.data();
  //   if (!peerConnection.currentRemoteDescription && data && data.answer) {
  //     console.log("Got remote description: ", data.answer);
  //     const rtcSessionDescription = new RTCSessionDescription(data.answer);
  //     await peerConnection.setRemoteDescription(rtcSessionDescription);
  //   }
  // });
  // Listening for remote session description above

  // Listen for remote ICE candidates below
  onSnapshot(collection(roomRef, "calleeCandidates"), (snapshot) => {
    console.log("calleeCandidates snapshot: ");
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  // Listen for remote ICE candidates above
}

function registerPeerConnectionListeners() {
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

  peerConnection.addEventListener("iceconnectionstatechange ", () => {
    console.log(
      `ICE connection state change: ${peerConnection.iceConnectionState}`,
    );
  });
}
