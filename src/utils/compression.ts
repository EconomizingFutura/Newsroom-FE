import pako from "pako";
import imageCompression from "browser-image-compression";

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize) as any);
    }
    return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

export async function compressAndEncode(input: File | string) {
    let base64: string;

    if (typeof input === "string") {
        base64 = input.startsWith("data:") ? input : `data:image/png;base64,${input}`;
    } else {
        const compressed = await imageCompression(input, {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 800,
            useWebWorker: true,
        });
        base64 = await fileToBase64(compressed);
    }

    const stripped = base64.split(",")[1];
    const binary = base64ToUint8Array(stripped);
    const compressedBytes = pako.deflate(binary);

    return uint8ArrayToBase64(compressedBytes);
}

export function decodeThumbnail(compressedBase64: string, mime = "image/png") {
    const compressedBytes = base64ToUint8Array(compressedBase64);
    const decompressed = pako.inflate(compressedBytes);
    return `data:${mime};base64,${uint8ArrayToBase64(decompressed)}`;
}

export async function createThumbnail(file: File | string) {
    if (typeof file === "string") {
        // Already base64 string
        return file.startsWith("data:") ? file : `data:image/png;base64,${file}`;
    }

    // Resize + convert to WebP
    const compressed = await imageCompression(file, {
        maxSizeMB: 0.1,            // target ~100KB
        maxWidthOrHeight: 300,     // small thumbnail size
        fileType: "image/webp",    // modern format
        initialQuality: 0.6,       // reduce quality
        useWebWorker: true,
    });

    return await fileToBase64(compressed);
}

export function base64ToFile(base64: string, fileName: string): File {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
}