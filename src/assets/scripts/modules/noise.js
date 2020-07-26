export function noise() {
  if (!window.AudioContext) return;

  const audioCtx = new window.AudioContext();
  const bufferSize = audioCtx.sampleRate / 3;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);

  const gainNode = audioCtx.createGain();

  gainNode.gain.setValueAtTime(0.012, audioCtx.currentTime);
  gainNode.connect(audioCtx.destination);

  for (
    let i = 0, noiseBufferOutput = noiseBuffer.getChannelData(0);
    i < bufferSize;
    i++
  ) {
    noiseBufferOutput[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = audioCtx.createBufferSource();

  whiteNoise.buffer = noiseBuffer;
  whiteNoise.connect(gainNode);
  whiteNoise.start(0);
  whiteNoise.onended = () => {
    whiteNoise.disconnect();
    gainNode.disconnect();
    audioCtx.close();
  };
}
