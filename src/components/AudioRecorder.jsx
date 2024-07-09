import React, { useRef, useState, useEffect } from 'react';
import AudioAnalyser from './AudioAnalyser';

const AudioRecorder = ({ isHost }) => {
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioStream, setAudioStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      console.log('Recording started');
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordings(prevRecordings => [
          ...prevRecordings,
          { url: audioUrl, blob: audioBlob }
        ]);
        audioChunksRef.current = [];
        setRecording(false);
        clearInterval(timerRef.current);
        console.log('Recording stopped');
      };
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div>
      {isHost && (
        <>
          <button onClick={startRecording} disabled={recording}>Start Recording</button>
          <button onClick={stopRecording} disabled={!recording}>Stop Recording</button>
          {recording && <p>Recording Time: {formatTime(recordingTime)}</p>}
          {recording && audioStream && <AudioAnalyser audioStream={audioStream} />}
        </>
      )}
      <h2>Recordings:</h2>
      <ul>
        {recordings.map((recording, index) => (
          <li key={index}>
            <audio controls src={recording.url}></audio>
            <a href={recording.url} download={`recording-${index + 1}.wav`}>Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AudioRecorder;
