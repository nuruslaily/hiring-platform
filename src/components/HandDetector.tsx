import React, { useRef, useEffect, useState } from "react";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import opencamera1 from "../assets/open-camera1.png";
import opencamera2 from "../assets/open-camera2.png";
import opencamera3 from "../assets/open-camera3.png";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
export default function HandDetector({
  onCapture,
}: {
  onCapture: (filename: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const [status, setStatus] = useState("Idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  // const [poseLocked, setPoseLocked] = useState(false);
  const poseLocked = useRef(false);

  const startCountdown = (video: HTMLVideoElement) => {
    if (isCounting) return; // cegah double countdown

    setIsCounting(true);
    poseLocked.current = true;
    setCountdown(3);
    let counter = 3;

    const interval = setInterval(() => {
      counter -= 1;
      if (counter > 0) {
        setCountdown(counter);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setIsCounting(false);

        // lakukan capture image
        captureImage(video);
        setStatus("📸 Pose 3 captured!");
        poseLocked.current = false;
      }
    }, 1000);
  };

  // deteksi jari
  const isFingerUp = (landmarks: any, tipIdx: number, pipIdx: number) =>
    landmarks[tipIdx].y < landmarks[pipIdx].y;

  // identifikasi pose (1, 2, 3 jari)
  const getHandPose = (landmarks: any) => {
    if (!landmarks || landmarks.length < 21) return "none";

    const indexUp = isFingerUp(landmarks, 8, 6);
    const middleUp = isFingerUp(landmarks, 12, 10);
    const ringUp = isFingerUp(landmarks, 16, 14);
    const pinkyUp = isFingerUp(landmarks, 20, 18);

    if (indexUp && !middleUp && !ringUp && !pinkyUp) return "pose1"; // 1 jari
    if (indexUp && middleUp && !ringUp && !pinkyUp) return "pose2"; // 2 jari
    if (indexUp && middleUp && ringUp && !pinkyUp) return "pose3"; // 3 jari
    return "none";
  };

  // gambar bounding box + label
  const drawBoundingBox = (
    ctx: CanvasRenderingContext2D,
    landmarks: any,
    pose: string
  ) => {
    const xs = landmarks.map((p: any) => p.x * ctx.canvas.width);
    const ys = landmarks.map((p: any) => p.y * ctx.canvas.height);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const color =
      pose === "pose1" || pose === "pose2" || pose === "pose3"
        ? "#22c55e"
        : "#ef4444";

    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(minX - 10, minY - 10, maxX - minX + 20, maxY - minY + 20);

    ctx.font = "18px sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(
      pose === "none" ? "Undetected" : pose.toUpperCase(),
      minX,
      minY - 10
    );
  };

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!video) return;

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.6,
    });

    hands.onResults(async (results) => {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      }

      if (
        results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0 &&
        ctx
      ) {
        const landmarks = results.multiHandLandmarks[0];
        const pose = getHandPose(landmarks);

        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { lineWidth: 2 });
        drawLandmarks(ctx, landmarks, { lineWidth: 1 });
        drawBoundingBox(ctx, landmarks, pose);

        if (pose === "pose3" && !poseLocked.current) {
          setStatus("✌️ Pose 3 detected!");
          if (video) startCountdown(video);
        } else {
          setStatus("🙌 Arahkan tangan untuk pose 3");
        }
      } else {
        setStatus("🙌 Tidak ada tangan.");
      }
    });

    const camera = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 600,
      height: 440,
    });

    camera.start();

    // simpan instance ke ref agar bisa diakses ulang
    cameraRef.current = camera;
    handsRef.current = hands;

    return () => {
      camera.stop();
    };
  }, []);

  const captureImage = (video: any) => {
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = video.videoWidth;
    tmpCanvas.height = video.videoHeight;
    const ctx = tmpCanvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, tmpCanvas.width, tmpCanvas.height);
    const dataUrl = tmpCanvas.toDataURL("image/png");
    setDownloadUrl(dataUrl);
  };

  const handleRetake = async () => {
    setDownloadUrl(null);
    poseLocked.current = false;
    setStatus("🙌 Arahkan tangan untuk pose 3");

    if (cameraRef.current) {
      await cameraRef.current.stop();
      cameraRef.current = null;
    }

    // Buat ulang instance hands baru
    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }

    const video = videoRef.current;
    if (!video) return;

    // Buat ulang instance Hands dan Camera
    const newHands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
    });
    newHands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.6,
    });

    newHands.onResults((results) => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(results.image, 0, 0, ctx.canvas.width, ctx.canvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const pose = getHandPose(landmarks);
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { lineWidth: 2 });
        drawLandmarks(ctx, landmarks, { lineWidth: 1 });
        drawBoundingBox(ctx, landmarks, pose);

        if (pose === "pose3" && !poseLocked.current) {
          setStatus("✌️ Pose 3 detected!");
          startCountdown(video);
        }
      } else {
        setStatus("🙌 Tidak ada tangan.");
      }
    });

    handsRef.current = newHands;

    const newCamera = new Camera(video, {
      onFrame: async () => {
        await newHands.send({ image: video });
      },
      width: 600,
      height: 440,
    });

    cameraRef.current = newCamera;
    newCamera.start();
  };

  const handleSubmit = () => {
    if (downloadUrl) {
      if (cameraRef.current) cameraRef.current.stop();
      onCapture(downloadUrl);
    }
  };

  const poses = [opencamera1, opencamera2, opencamera3];

  console.log("CEK: ", downloadUrl);

  return (
    <div className="text-center bg-white p-4">
      <div className="relative inline-block bg-white">
        {downloadUrl ? (
          <>
            <img
              src={downloadUrl}
              alt="Captured"
              className="rounded-2xl shadow-lg w-[600px] h-[440px] object-cover"
            />
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleRetake}
                className="bg-white border border-[#E0E0E0] text-[#1D1F20] px-4 py-2 rounded-lg hover:text-white hover:bg-[#616161] transition"
              >
                Retake photo
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#01959F] text-white px-4 py-2 rounded-lg hover:bg-[#01777F] transition"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              width="600"
              height="440"
              style={{ display: "none" }}
            />
            {countdown !== null && (
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-white bg-black/50 px-6 py-3 rounded-2xl shadow-lg">
                {countdown}
              </div>
            )}
            <canvas ref={canvasRef} width="600" height="440" />
            <p className="text-start text-xs text-[#1D1F20] mb-4">
              <p className="text-black">{status}</p>
              To take a picture, follow the hand poses in the order shown below.
              The system will automatically capture the image once the final
              pose is detected.
            </p>

            {/* Pose instructions */}
            <div className="flex justify-center items-center gap-4">
              {poses.map((pose, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center text-[#404040] text-xs">
                    <img
                      src={pose}
                      alt={`Pose ${index + 1}`}
                      className="w-14 h-14 rounded-md border border-gray-200"
                    />
                  </div>

                  {/* Tampilkan panah di antara gambar */}
                  {index < poses.length - 1 && (
                    <ChevronRightIcon className="w-6 h-6 text-[#404040]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
