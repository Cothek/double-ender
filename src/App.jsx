import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import PeerConnection from './components/PeerConnection';
import './App.css';

const App = () => {
  const [isHost, setIsHost] = useState(false);
  const [connected, setConnected] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [showHostOptions, setShowHostOptions] = useState(false);
  const [showJoinOptions, setShowJoinOptions] = useState(false);
  const [participants, setParticipants] = useState([]);

  const selectHost = () => {
    setIsHost(true);
    setBackgroundColor('pastel-green');
    setShowHostOptions(true);
    setShowJoinOptions(false);
  };

  const startHosting = () => {
    setConnected(true);
    setShowHostOptions(false);
    setParticipants(['Host']); // Add the host to the participants list
  };

  const selectJoin = () => {
    setIsHost(false);
    setBackgroundColor('pastel-blue');
    setShowJoinOptions(true);
    setShowHostOptions(false);
  };

  const joinSession = () => {
    setConnected(true);
    setShowJoinOptions(false);
    setParticipants(prev => [...prev, `Participant ${prev.length + 1}`]); // Add a new participant
  };

  return (
    <div className={`app ${backgroundColor}`}>
      <h1>Double Ender App</h1>
      <button className="host-button" onClick={selectHost}>Host</button>
      <button className="join-button" onClick={selectJoin}>Join</button>
      {!connected ? (
        <>
          {showHostOptions && <button onClick={startHosting}>Start Hosting</button>}
          {showJoinOptions && <button onClick={joinSession}>Connect to Host</button>}
        </>
      ) : (
        <>
          {isHost && <AudioRecorder isHost={isHost} />}
          <PeerConnection isHost={isHost} />
          <h2>Participants:</h2>
          <ul>
            {participants.map((participant, index) => (
              <li key={index}>{participant}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
