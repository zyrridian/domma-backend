import Hapi from "@hapi/hapi";
import { ProfileService } from "../services/profile.service";
import { UpdateProfileRequest } from "../dto/profile.dto";

export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  /**
   * Get the current user's profile
   */
  getProfile = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const profile = await this.profileService.getProfile(userId);

      if (!profile) {
        return h
          .response({
            success: false,
            message: "Profile not found",
          })
          .code(404);
      }

      return h.response(profile).code(200);
    } catch (error: any) {
      return h
        .response({
          success: false,
          message: error.message,
        })
        .code(500);
    }
  };

  /**
   * Update the current user's profile
   */
  updateProfile = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const payload = request.payload as UpdateProfileRequest;

      const updatedProfile = await this.profileService.updateProfile(
        userId,
        payload
      );

      return h.response(updatedProfile).code(200)
    } catch (error: any) {
      return h
        .response({
          success: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Upload the user's profile picture
   * Expects multipart/form-data with a file field
   */
  uploadProfilePicture = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const data = request.payload as any;
      
      if (!data.file) {
        return h
          .response({
            success: false,
            message: "No file was uploaded",
          })
          .code(400);
      }

      // Extract file data
      const file = data.file;
      const buffer = Buffer.from(file, 'binary');
      const filename = data.filename || 'profile-picture.jpg';
      
      const result = await this.profileService.uploadProfilePicture(
        userId,
        buffer,
        filename
      );

      return h.response(result).code(201);
    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      return h
        .response({
          success: false,
          message: error.message || "Failed to upload profile picture",
        })
        .code(400);
    }
  };
}
