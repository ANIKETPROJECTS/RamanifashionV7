import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    const missing = [
      !cloudName && "CLOUDINARY_CLOUD_NAME",
      !apiKey && "CLOUDINARY_API_KEY",
      !apiSecret && "CLOUDINARY_API_SECRET",
    ].filter(Boolean);
    throw new Error(`Missing Cloudinary environment variables: ${missing.join(", ")}. Add them to your .env file.`);
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

async function compressImage(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  return image
    .resize({
      width: 1200,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82, progressive: true })
    .toBuffer();
}

export async function uploadToCloudinary(
  buffer: Buffer,
  originalName: string,
): Promise<string> {
  configureCloudinary();
  console.log(`[Cloudinary] Compressing image: ${originalName} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);

  const compressed = await compressImage(buffer);
  console.log(`[Cloudinary] Compressed to: ${(compressed.length / 1024 / 1024).toFixed(2)} MB`);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ramani-fashion/products",
        resource_type: "image",
        use_filename: false,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] Upload error:", error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error("No result from Cloudinary upload"));
        }
        console.log(`[Cloudinary] Uploaded successfully: ${result.secure_url}`);
        resolve(result.secure_url);
      },
    );
    uploadStream.end(compressed);
  });
}

export default cloudinary;
