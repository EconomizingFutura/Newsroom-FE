import { Mic, Trash, Upload, Video } from "lucide-react";
import VideoPlayer from "@/components/ui/VideoPlayer";
import AudioPlayer from "@/components/ui/AudioPlayer";
import { ImageWithFallback } from "@/components/ImageWithFallback";

type VideoContainerProps = {
  video: File | null; // video file object or null
  setValue: (
    field: "video" | "thumbnail",
    value: File | string | null,
    options?: { shouldValidate: boolean; shouldDirty: boolean }
  ) => void;
  thumbnail?: string;
};

type AudioContainerProps = {
  audio: File | string | null;
  setValue: (
    field: "audio" | "thumbnail",
    value: File | string | null,
    options?: { shouldValidate: boolean }
  ) => void;
};

export const VideoContainer: React.FC<VideoContainerProps> = ({
  video,
  setValue,
  thumbnail,
}) => (
  <div className="mt-6">
    {!video ? (
      <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 text-[#9f2e00] flex items-center justify-center">
          <Video className="h-6 w-6" />
        </div>
        <p className="mt-6 font-medium">Upload video</p>
        <p className="text-sm text-gray-500 mt-1">
          Drag & drop your video file or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Supports MP4, MOV, AVI (Max 1MB)
        </p>
        <label className="inline-flex items-center gap-2 mt-6 bg-orange-700 text-white px-4 py-2 rounded-lg cursor-pointer">
          <Upload className="h-4 w-4" />
          <span>Choose File</span>
          <input
            type="file"
            accept=".mp4,.mov,.avi"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 1 * 1024 * 1024) {
                  // 1 MB
                  alert("Video must be less than 1 MB");
                  e.target.value = ""; // reset input so user can re-select
                  return;
                }
                setValue("video", file, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              } else {
                setValue("video", null, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
          />
        </label>
      </div>
    ) : (
      <VideoPlayer
        src={video}
        onThumbnailGenerated={(thumb) => setValue("thumbnail", thumb)}
        onDelete={() => {
          setValue("video", null);
          setValue("thumbnail", "");
        }}
      />
    )}
    {/* Thumbnail */}
    {video && (
      <div className="mt-4">
        <label className="block text-sm font-medium">Thumbnail Preview</label>
        <div className="mt-2 h-28 w-[132px] bg-gray-100 rounded-xl">
          {thumbnail && (
            <ImageWithFallback
              src={thumbnail}
              alt="Generated Thumbnail"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    )}
  </div>
);

export const AudioContainer: React.FC<AudioContainerProps> = ({
  audio,
  setValue,
}) => {
  const isUrl = typeof audio === "string";

  const handleRomoveAudio = () => {
    setValue("audio", null);
  };

  return (
    <div className="mt-6">
      {!audio ? (
        <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 text-[#a32fff] bg-[linear-gradient(155.43deg,#F2E5FF_14.63%,#E2C7FD_82.69%)] flex items-center justify-center">
            <Mic className="h-6 w-6" />
          </div>
          <p className="mt-6 font-medium">Upload audio file</p>
          <p className="text-sm text-gray-500 mt-1">
            Supports MP3, WAV, M4A (Max 1MB)
          </p>
          <label className="inline-flex items-center gap-2 mt-6 bg-green-100 text-green-800 px-4 py-2 rounded-lg cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>Choose File</span>
            <input
              type="file"
              accept=".mp3,.wav,.m4a,.mpeg"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 1 * 1024 * 1024) {
                    // 1 MB
                    alert("File size must be less than 1 MB");
                    e.target.value = ""; // reset input
                    return;
                  }
                  setValue("audio", file, { shouldValidate: true });
                } else {
                  setValue("audio", null, { shouldValidate: true });
                }
              }}
            />
          </label>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl text-end">
          <div>
            <button
              type="button"
              onClick={handleRomoveAudio}
              className="  bg-red-400 flex items-center gap-2 ml-auto mx-8 my-4 w-min text-white text-sm px-3 py-1 rounded-lg shadow"
            >
              <Trash size={12} /> Remove
            </button>
          </div>
          <div className="p-2">
            {isUrl ? (
              <AudioUrlPlayer src={audio as string} />
            ) : (
              <AudioPlayer src={audio} fileName={(audio as File).name} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

type VideoUrlPlayerProps = {
  videoUrl: string;
  thumbnailUrl?: string;
  onDelete?: () => void;
};
const VideoUrlPlayer: React.FC<VideoUrlPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  onDelete,
}) => {
  return (
    <div className="">
      {/* Video Player */}
      <div className="relative rounded-xl overflow-hidden shadow-md bg-black">
        <video
          src={videoUrl}
          controls
          playsInline
          preload="metadata"
          className="w-full h-64 rounded-xl object-cover"
        >
          Your browser does not support the video tag.
        </video>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="absolute top-2 right-2 bg-red-600 text-white text-sm px-3 py-1 rounded-lg shadow"
          >
            Remove
          </button>
        )}
      </div>

      {/* Thumbnail Preview */}
      {thumbnailUrl && (
        <div className="mt-4">
          <label className="block text-sm font-medium">Thumbnail Preview</label>
          <div className="mt-2 h-28 w-full bg-gray-100 rounded-xl overflow-hidden">
            <ImageWithFallback
              src={thumbnailUrl}
              alt="Video Thumbnail"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUrlPlayer;

interface AudioUrlPlayerProps {
  src: string;
  fileName?: string;
}

export const AudioUrlPlayer: React.FC<AudioUrlPlayerProps> = ({
  src,
  fileName,
}) => {
  return (
    <div className="p-4 flex flex-col items-center">
      {fileName && <p className="mb-2 text-sm text-gray-500">{fileName}</p>}
      <audio controls className="w-full rounded-lg">
        <source src={src} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
