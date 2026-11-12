import confetti from "canvas-confetti";
import { useEffect, useRef, useState } from "react";

const useContainer = () => {
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<ReturnType<typeof confetti.create> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    confettiRef.current = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });

    return () => {
      confettiRef.current?.reset();
    };
  }, []);

  const handleCelebrate = () => {
    confettiRef.current?.({
      particleCount: 100,
      spread: 50,
      origin: { y: 1.2 },
    });
  };

  return {
    handleCelebrate,
    canvasRef,
    showErrorOverlay,
    setShowErrorOverlay,
    showSuccessOverlay,
    setShowSuccessOverlay,
  };
};

export default useContainer;
