async function setupPixelStreaming(signallingServerUrl, videoElement) {
  const pc = new RTCPeerConnection();
  pc.ontrack = (event) => { videoElement.srcObject = event.streams[0]; };

  const ws = new WebSocket(signallingServerUrl);

  ws.onopen = async () => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    ws.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
  };

  ws.onmessage = async (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === "answer") {
      const answer = { type: "answer", sdp: msg.sdp };
      await pc.setRemoteDescription(answer);
    }
    if (msg.type === "iceCandidate") {
      await pc.addIceCandidate(msg.candidate);
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      ws.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
    }
  };
}
