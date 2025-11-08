import { uploadToS3 } from "@/config/s3Config";
import type { scheduledPostArray } from "@/types/apitypes";

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
async function processAndUploadImages(html: string): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = doc.querySelectorAll("img");

  for (const img of images) {
    if (img.src.startsWith("data:")) {
      // Convert base64 to file
      const file = base64ToFile(img.src, "upload.jpg");
      // Upload to S3
      const imageUrl = await uploadToS3(file, "TEXT", "draft");
      // Replace src with S3 URL
      img.setAttribute("src", imageUrl);
    }
  }

  return doc.body.innerHTML; // cleaned HTML with S3 URLs
}

export function extractTextSummary(
  html: unknown,
  wordLimit: number = 30
): { text: string; wordCount: number } {
  // Ensure input is a string
  const content = typeof html === "string" ? html : "";

  // 1. Strip HTML tags
  const plainText = content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 2. Split into words
  const words = plainText.split(" ").filter(Boolean);

  // 3. Word count
  const wordCount = words.length;

  // 4. Truncate if exceeds limit
  const truncated =
    wordCount > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "…"
      : plainText;

  return {
    text: truncated,
    wordCount,
  };
}

export default processAndUploadImages;

export const transformPlatformsToScheduledPosts = (
  platforms: { platformName: string; date: string; time: string }[]
): scheduledPostArray[] => {
  return platforms.map((p) => ({
    platform: p.platformName.trim().toLowerCase(),
    date: p.date,
    time: p.time,
    isPosted: false,
  }));
};
