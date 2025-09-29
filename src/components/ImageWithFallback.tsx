import React, { useState } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4=";

const ERROR_AUDIO_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxjaXJjbGUgY3g9IjQ0IiBjeT0iNDQiIHI9IjI4Ii8+PHBhdGggZD0iTTM0IDM0djIwIi8+PHBhdGggZD0iTTQ0IDM0djIwIi8+PHBhdGggZD0iTTU0IDM0djIwIi8+PC9zdmc+";


const ERROR_VIDEO_SRC =   "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwb2x5bGluZSBwb2ludHM9IjM2LDMwIDU0LDQ0IDM2LDU4IDM2LDMwIi8+PC9zdmc+";


interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  mediaType?: "image" | "audio" | "video";
}

export function ImageWithFallback({
  src,
  alt,
  className,
  style,
  mediaType = "image",
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => setDidError(true);

  const fallback =
    mediaType === "audio"
      ? ERROR_AUDIO_SRC
      : mediaType === "video"
      ? ERROR_VIDEO_SRC
      : ERROR_IMG_SRC;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          src={fallback}
          alt="Error loading media"
          {...rest}
          data-original-url={src}
        />
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}
