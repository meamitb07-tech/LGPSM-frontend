import { apiClient, ApiResponse } from "./apiClient";

export interface PresignPayload {
  fileName: string;
  fileType: string;
  folder?: string;
}

export interface PresignData {
  uploadUrl: string;
  fileKey: string;
  publicUrl?: string;
}

export const mediaService = {
  /**
   * Request a presigned S3 upload URL from the backend
   * POST /api/v1/media/presign
   */
  async presignUpload(payload: PresignPayload): Promise<ApiResponse<PresignData>> {
    return apiClient<PresignData>("/api/v1/media/presign", {
      method: "POST",
      body: JSON.stringify(payload),
    }, true);
  },

  /**
   * Upload file directly to S3 using the presigned URL
   */
  async uploadToS3(uploadUrl: string, file: File): Promise<boolean> {
    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};
