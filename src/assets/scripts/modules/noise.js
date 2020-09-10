function noise() {
  if (!window.AudioContext) return;

  try {
    const audioCtx = new window.AudioContext();
    const bufferSize = audioCtx.sampleRate / 3;
    const noiseBuffer = audioCtx.createBuffer(
      1,
      bufferSize,
      audioCtx.sampleRate,
    );

    const gainNode = audioCtx.createGain();

    gainNode.gain.setValueAtTime(0.008, audioCtx.currentTime);
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
    whiteNoise.loop = true;
    whiteNoise.start(0);
    whiteNoise.onended = () => {
      whiteNoise.disconnect();
      gainNode.disconnect();
      audioCtx.close();
    };

    return whiteNoise;
  } catch (e) {
    if (process.env.ELEVENTY_ENV !== 'production') {
      console.error(e);
    }
  }
}

let noiseInstance = null;

export function startNoise() {
  if (noiseInstance != null) return;
  noiseInstance = noise();
}

export function stopNoise() {
  if (noiseInstance) {
    noiseInstance.stop();
    noiseInstance = null;
  }
}
