import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2, Play, Pause } from "lucide-react";
import { ImageWithFallback } from "../ImageWithFallback";

export default function VideoPreview({
  src,
  thumbnailUrl,
  onDelete,
  onThumbnailGenerated,
}: {
  src?: File;
  thumbnailUrl?: string;
  onDelete?: () => void;
  onThumbnailGenerated?: (thumbnail: string) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const srcBlob = useMemo(() => (src ? URL.createObjectURL(src) : null), [src]);

  // Generate thumbnail if none provided
  useEffect(() => {
    if (!srcBlob || thumbnailUrl) return;

    const video = document.createElement("video");
    video.src = srcBlob;
    video.currentTime = 1;
    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumb = canvas.toDataURL("image/png");
      setThumbnail(thumb);
      onThumbnailGenerated?.(thumb);
    };
  }, [srcBlob, thumbnailUrl, onThumbnailGenerated]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Track time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const setMeta = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", setMeta);
    video.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", setMeta);
    };
  }, []);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const value = Number(e.target.value);
    videoRef.current.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className="relative w-full mx-auto rounded-xl overflow-hidden group bg-black">
      {srcBlob ? (
        <>
          <video
            ref={videoRef}
            src={srcBlob}
            className="w-full max-h-80 object-contain rounded-xl"
            controls={false}
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition bg-gradient-to-b from-black/40 via-transparent to-black/40">
            {/* Top bar */}
            <div className="flex justify-end p-3">
              <button
                onClick={onDelete}
                className="bg-white p-2 rounded-full shadow-md hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>

            {/* Bottom controls */}
            <div className="px-4 pb-4 w-full">
              {/* Seek bar + timer */}
              <div className="flex items-center gap-3">
                <span className="text-white text-sm font-mono min-w-[40px]">
                  {formatTime(currentTime)}
                </span>

                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 accent-green-600 cursor-pointer"
                />

                <span className="text-white text-sm font-mono min-w-[40px] text-right">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Play button */}
              <div className="flex justify-center mt-3">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:scale-110 transition"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-black" />
                  ) : (
                    <Play className="w-6 h-6 text-green-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ImageWithFallback
          src={thumbnailUrl || thumbnail || "/default-thumbnail.jpg"}
          alt="Video thumbnail"
          className="w-full h-auto rounded-xl"
        />
      )}
    </div>
  );
}
