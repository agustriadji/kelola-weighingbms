'use client';

import { useRef, useState } from 'react';
import { Camera, Video, Square } from 'lucide-react';
import { StyledButton } from '../atoms/StyledButton';
import Image from 'next/image';

function CCTVStreamModule({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null); // snapshot final

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = s;
      setStream(s);
    } catch (err) {
      alert('Tidak dapat mengakses kamera');
      console.error(err);
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL('image/jpeg');
    setImage(data);

    onCapture?.(data);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {!stream ? (
          <StyledButton onClick={startCamera} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Video className="w-4 h-4" /> Start Cam
          </StyledButton>
        ) : (
          <StyledButton onClick={stopCamera} className="bg-red-600 hover:bg-red-700 text-white">
            <Square className="w-4 h-4" /> Stop Cam
          </StyledButton>
        )}

        {stream && (
          <StyledButton
            onClick={capture}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Camera className="w-4 h-4" /> Capture
          </StyledButton>
        )}
      </div>

      {/* Live Video */}
      {stream && <video ref={videoRef} autoPlay className="rounded border w-full" />}

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Snapshot Preview */}
      {image && (
        <div>
          <p className="text-sm text-gray-600">Snapshot:</p>
          <Image src={image} alt="CCTV Snapshot" className="rounded border w-full" />
        </div>
      )}
    </div>
  );
}

export function CCTVStreamMolecule({ control, Controller }) {
  return (
    <Controller
      name="snapshot_inbound"
      control={control}
      render={({ field }) => <CCTVStreamModule onCapture={field.onChange} />}
    />
  );
}
