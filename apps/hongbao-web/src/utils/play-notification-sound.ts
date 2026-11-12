let audioContext: AudioContext | null = null;

/**
 * Synthesizes a short two-tone "ding" via the Web Audio API instead of
 * shipping an audio file — keeps the bundle asset-free.
 */
export function playNotificationSound() {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return;

    audioContext ??= new AudioContextClass();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const now = audioContext.currentTime;

    const playTone = (frequency: number, start: number, duration: number) => {
      const oscillator = audioContext!.createOscillator();
      const gain = audioContext!.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.2, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

      oscillator.connect(gain);
      gain.connect(audioContext!.destination);

      oscillator.start(now + start);
      oscillator.stop(now + start + duration);
    };

    playTone(880, 0, 0.15);
    playTone(1320, 0.12, 0.18);
  } catch (error) {
    console.error("Failed to play notification sound:", error);
  }
}
