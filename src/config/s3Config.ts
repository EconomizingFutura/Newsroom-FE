import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: import.meta.env.VITE_S3_LOCATION,
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_S3_SECRET,
  },
  forcePathStyle: false,
  useAccelerateEndpoint: false,
  useDualstackEndpoint: false,
});

type ArticleType = "video" | "audio" | "thumbnail" | "TEXT";
type submitType = "save" | "draft";

export const uploadToS3 = async (
  file: File,
  type: ArticleType,
  submitType: submitType
) => {
  const id = uuidv4();

  const bucket = import.meta.env.VITE_S3_BUCKET;
  const region = import.meta.env.VITE_S3_LOCATION;
  const safeFileName = file.name.replace(/\s+/g, "_"); // replace spaces with _
  const key = `${submitType}/${type}/${id}-${encodeURIComponent(safeFileName)}`;

  try {
    const fileBuffer = new Uint8Array(await file.arrayBuffer());
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: file.type || "application/octet-stream",
      ContentDisposition: `attachment; filename="${file.name}"`,
    });

    await s3.send(command);

    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return fileUrl;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw error;
  }
};
export const deleteFromS3 = async (fileKey: string) => {
  const bucket = import.meta.env.VITE_S3_BUCKET || "integrated-newsroom";

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: fileKey,
    });

    await s3.send(command);
    console.log("File deleted successfully:", fileKey);
    return true;
  } catch (error) {
    console.error("S3 Delete Error:", error);
    return false;
  }
};
