import React, { useRef, useEffect } from 'react';

const AudioAnalyser = ({ audioStream }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (audioStream) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(audioStream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      source.connect(analyserRef.current);
      draw();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioStream]);

  const draw = () => {
    if (analyserRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');
      const { width, height } = canvas;
      canvasCtx.clearRect(0, 0, width, height);

      const barWidth = (width / dataArrayRef.current.length) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        barHeight = dataArrayRef.current[i];

        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
      animationFrameRef.current = requestAnimationFrame(draw);
    }
  };

  return <canvas ref={canvasRef} width="300" height="150" />;
};

export default AudioAnalyser;
