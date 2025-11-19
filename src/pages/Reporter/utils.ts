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
export default async function processAndUploadImages(html: string) {
  if (!html) return html;

  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const matches = [...html.matchAll(imgRegex)];

  if (matches.length === 0) return html;

  let updatedHTML = html;

  for (const match of matches) {
    const src = match[1];

    // --- 1️⃣ Base64 Detection ---
    const isBase64Image = /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(src);
    if (!isBase64Image) continue; // Skip S3, Blob, File, External URLs

    // --- 2️⃣ Convert base64 -> File ---
    const ext = src.substring(11, src.indexOf(";")).split("/")[1] || "png";
    const filename = crypto.randomUUID() + "." + ext;
    const file = base64ToFile(src, filename);

    // --- 3️⃣ Upload ---
    const s3url = await uploadToS3(file, "TEXT", "draft");

    // --- 4️⃣ Replace this base64 image with S3 URL ---
    updatedHTML = updatedHTML.replace(src, s3url);
  }

  return updatedHTML;
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

export const transformPlatformsToScheduledPosts = (
  platforms: { platformName: string; date: string; time: string }[]
): scheduledPostArray[] => {
  return platforms
    .map((p) => ({
      platform: p.platformName.trim().toLowerCase(),
      date: p.date,
      time: p.time,
      isPosted: false,
    }))
    .filter((a) => a.platform.toLowerCase() !== "all");
};

export const buildScheduledPost = (
  platform: string,
  datetime: Date,
  isPosted: boolean = false
): scheduledPostArray => {
  const date = datetime.toISOString().split("T")[0];

  const timeObj = datetime.toISOString().split("T")[1].substring(0, 5);

  return {
    platform,
    date,
    time: timeObj,
    isPosted,
  };
};
