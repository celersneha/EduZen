import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload video to Cloudinary
 * @param {Buffer} fileBuffer - Video file buffer
 * @param {string} folder - Cloudinary folder path
 * @param {string} fileName - Original file name
 * @returns {Promise<{publicId: string, url: string, duration: number, bytes: number, thumbnailUrl?: string}>}
 */
export async function uploadVideoToCloudinary(
  fileBuffer,
  folder,
  fileName
) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: folder,
        public_id: fileName.replace(/\.[^/.]+$/, ''), // Remove file extension
        chunk_size: 6000000, // 6MB chunks for large files
        // Let Cloudinary handle video format automatically
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        // Extract video duration and other metadata
        const duration = result.duration || 0;
        const bytes = result.bytes || 0;

        // Generate thumbnail URL (Cloudinary auto-generates thumbnails)
        const thumbnailUrl = cloudinary.url(result.public_id, {
          resource_type: 'video',
          format: 'jpg',
          transformation: [
            { width: 1280, height: 720, crop: 'fill' },
            { quality: 'auto' },
          ],
        });

        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          duration: Math.round(duration),
          bytes: bytes,
          thumbnailUrl: thumbnailUrl,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete video from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<void>}
 */
export async function deleteVideoFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video',
    });
  } catch (error) {
    console.error('Error deleting video from Cloudinary:', error);
    throw error;
  }
}

export { cloudinary };

