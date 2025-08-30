import React, { useRef, useState, useEffect, useMemo } from "react";
import { Play, Pause, Mic } from "lucide-react";

const AudioPlayer = ({ src, fileName }: { src: any; fileName: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const srcBob = useMemo(() => URL.createObjectURL(src), [src]);
  useEffect(() => {
    // reset when new file is loaded
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    
  }, [src]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error("Play error:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress(audio.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Number(e.target.value);
      setProgress(audio.currentTime);
    }
  };

  return (
    <div className="flex items-center justify-between bg-[#f7faf7] p-4 rounded-lg shadow w-full max-w-3xl">
      {/* Left: Icon + Name */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100">
          <Mic className="text-purple-700 w-6 h-6" />
        </div>
        <p className="font-semibold text-black">{fileName}</p>
      </div>

      {/* Middle: Progress */}
      <div className="flex flex-col items-center flex-1 px-6">
        <input
          type="range"
          min="0"
          max={duration}
          value={progress}
          onChange={handleSeek}
          className="w-full accent-green-600 cursor-pointer"
        />
        <div className="flex justify-between w-full text-sm text-gray-600">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Play/Pause */}
      <button
        type="button"
        onClick={togglePlay}
        className="flex items-center gap-2 px-4 py-2 border border-green-600 rounded-lg text-green-700 font-medium hover:bg-green-50"
      >
        {isPlaying ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Play</>}
      </button>

      {/* Hidden audio tag */}
      <audio
        ref={audioRef}
        src={srcBob}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default AudioPlayer;
