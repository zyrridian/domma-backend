import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string;

// Initialize Supabase with service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export class SupabaseService {
  /**
   * Upload a file to Supabase Storage
   * @param file The file buffer to upload
   * @param filename The filename with extension
   * @param bucket The storage bucket (default: 'profile-pictures')
   * @returns Promise with the public URL
   */
  async uploadFile(
    file: Buffer,
    filename: string,
    bucket: string = "profile-pictures"
  ): Promise<string> {
    try {
      // Check if bucket exists first
      const { data: buckets } = await supabase.storage.listBuckets();

      const bucketExists = buckets?.some((b) => b.name === bucket);

      if (!bucketExists) {
        // Create the bucket if it doesn't exist
        const { error: createBucketError } =
          await supabase.storage.createBucket(bucket, {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
          });

        if (createBucketError) {
          console.error("Error creating bucket:", createBucketError);
          throw new Error(
            `Failed to create bucket: ${createBucketError.message}`
          );
        }
      }

      // Upload the file
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, {
          contentType: this.getContentType(filename),
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      if (!data) {
        throw new Error("Upload failed with no data returned");
      }

      // Get the public URL for the file
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      return publicUrl;
    } catch (error: any) {
      console.error("Error in uploadFile:", error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Delete a file from Supabase Storage
   * @param path The path to the file in storage
   * @param bucket The storage bucket
   */
  async deleteFile(
    path: string,
    bucket: string = "profile-pictures"
  ): Promise<void> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) {
        throw new Error(`Failed to delete file: ${error.message}`);
      }
    } catch (error: any) {
      console.error("Error deleting file:", error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Get content type based on file extension
   * @param filename The filename with extension
   * @returns The MIME type
   */
  private getContentType(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      default:
        return "application/octet-stream";
    }
  }
}

// Export a singleton instance
export default new SupabaseService();
