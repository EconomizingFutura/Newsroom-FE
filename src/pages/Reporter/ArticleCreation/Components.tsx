import { Upload, Video } from "lucide-react";
import VideoPlayer from "@/components/ui/VideoPlayer";


type VideoContainerProps = {
    video: File | null; // video file object or null
    setValue: (
        field: "video" | "thumbnail",
        value: File | string | null,
        options?: { shouldValidate: boolean }
    ) => void;
    thumbnail: string;
};


export const VideoContainer: React.FC<VideoContainerProps> = ({ video, setValue, thumbnail }) => (<div className="mt-6">
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
                Supports MP4, MOV, AVI (Max 500MB)
            </p>
            <label className="inline-flex items-center gap-2 mt-6 bg-orange-700 text-white px-4 py-2 rounded-xl cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Choose File</span>
                <input
                    type="file"
                    accept=".mp4,.mov,.avi"
                    hidden
                    onChange={(e) =>
                        setValue("video", e.target.files?.[0] || null, {
                            shouldValidate: true,
                        })
                    }
                />
            </label>
        </div>
    ) : (
        <VideoPlayer
            src={video}
            onThumbnailGenerated={(thumb) =>
                setValue("thumbnail", thumb)
            }
            onDelete={() => {
                setValue("video", null);
                setValue("thumbnail", "");
            }}
        />
    )}

    {/* Thumbnail */}
    {video && (
        <div className="mt-4">
            <label className="block text-sm font-medium">
                Thumbnail Preview
            </label>
            <div className="mt-2 h-28 w-full bg-gray-100 rounded-xl">
                {thumbnail && (
                    <img
                        src={thumbnail}
                        alt="Generated Thumbnail"
                        className="h-full w-full object-cover"
                    />
                )}
            </div>
        </div>
    )}
</div>)