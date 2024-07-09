export const getLocalIP = () => {
    return new Promise((resolve, reject) => {
      const peer = new RTCPeerConnection();
      peer.createDataChannel('');
      peer.createOffer().then(offer => peer.setLocalDescription(offer));
  
      peer.onicecandidate = event => {
        if (!event || !event.candidate) {
          peer.close();
          return reject('Could not get local IP');
        }
  
        const ip = /([0-9]{1,3}\.){3}[0-9]{1,3}/.exec(event.candidate.candidate)[0];
        peer.close();
        resolve(ip);
      };
    });
  };
  