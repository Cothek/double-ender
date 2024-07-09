// src/PeerConnection.jsx
import React, { useState, useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';

const PeerConnection = ({ isHost }) => {
  const [peer, setPeer] = useState(null);
  const [signalData, setSignalData] = useState('');
  const [connected, setConnected] = useState(false);
  const pingsRef = useRef([]);

  useEffect(() => {
    if (peer) {
      setupPeerListeners(peer);
    }
  }, [peer]);

  const setupPeerListeners = (peerInstance) => {
    peerInstance.on('signal', data => {
      console.log('Signal Data:', JSON.stringify(data));
    });

    peerInstance.on('connect', () => {
      console.log('Peer connected');
      setConnected(true);
      if (isHost) {
        setInterval(sendPing, 1000);
      }
    });

    peerInstance.on('data', (data) => {
      if (data === 'ping') {
        peerInstance.send(`pong:${Date.now()}`);
      } else if (data.startsWith('pong:')) {
        const ping = Date.now() - parseInt(data.split(':')[1], 10);
        pingsRef.current.push(ping);
      }
    });

    peerInstance.on('error', err => console.error(err));
  };

  const startHosting = () => {
    const newPeer = new SimplePeer({ initiator: true, trickle: false });
    setPeer(newPeer);
  };

  const connectToHost = () => {
    const newPeer = new SimplePeer({ initiator: false, trickle: false });
    newPeer.signal(JSON.parse(signalData));
    setPeer(newPeer);
  };

  const sendPing = () => {
    peer.send(`ping:${Date.now()}`);
  };

  return (
    <div>
      <button onClick={startHosting}>Start Hosting</button>
      <input
        type="text"
        value={signalData}
        onChange={e => setSignalData(e.target.value)}
        placeholder="Paste host signal data here"
      />
      <button onClick={connectToHost}>Connect to Host</button>
    </div>
  );
};

export default PeerConnection;
