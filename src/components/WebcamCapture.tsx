/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

export default function WebcamCapture({ onCapture }: { onCapture: (imageSrc: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const retake = () => {
    setImgSrc(null);
    onCapture("");
  };

  return (
    <div className="webcam-container">
      {!imgSrc ? (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-100 rounded border"
            videoConstraints={{ facingMode: "user" }}
          />
          <button
            type="button"
            onClick={capture}
            className="btn btn-primary mt-3 w-100"
          >
            <i className="bi bi-camera me-2"></i>
            Capture Photo
          </button>
        </div>
      ) : (
        <div>
          <img src={imgSrc} alt="Captured" className="w-100 rounded border" />
          <button
            type="button"
            onClick={retake}
            className="btn btn-warning mt-3 w-100"
          >
            <i className="bi bi-arrow-repeat me-2"></i>
            Retake Photo
          </button>
        </div>
      )}
    </div>
  );
}
