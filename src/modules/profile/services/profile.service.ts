import { ProfileRepository } from "../repositories/profile.repository";
import {
  UserProfile,
  UpdateProfileRequest,
  UploadProfilePictureResponse,
  UpdateProfileResponse,
  GetProfileResponse,
} from "../dto/profile.dto";
import supabaseService from "../../../core/supabase/supabase.service";
import { v4 as uuidv4 } from "uuid";

export class ProfileService {
  private profileRepository: ProfileRepository;

  constructor() {
    this.profileRepository = new ProfileRepository();
  }

  /**
   * Get user profile by ID
   */
  async getProfile(id: string): Promise<GetProfileResponse> {
    const profile = await this.profileRepository.findByUserId(id);

    if (!profile) {
      throw new Error("Profile not found");
    }

    const result: GetProfileResponse = {
      success: true,
      data: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        university: profile.university,
        major: profile.major,
        created_at: profile.created_at.toISOString(),
        updated_at: profile.updated_at.toISOString(),
        profile_picture_url: profile.profile_picture_url,
      },
    };

    return result;
  }

  /**
   * Update profile
   */
  async updateProfile(
    id: string,
    payload: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    const updated = await this.profileRepository.update(id, payload);

    const result: UpdateProfileResponse = {
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updated.id,
        full_name: updated.full_name,
        email: updated.email,
        phone: updated.phone,
        university: updated.university,
        major: updated.major,
        updated_at: updated.updated_at.toISOString(),
        profile_picture_url: updated.profile_picture_url,
      },
    };

    return result;
  }

  /**
   * Upload profile picture to Supabase Storage and update user profile
   */
  async uploadProfilePicture(
    userId: string,
    fileBuffer: Buffer,
    filename: string
  ): Promise<UploadProfilePictureResponse> {
    // Generate a unique filename to prevent collisions
    const fileExtension = filename.split(".").pop() || "jpg";
    const uniqueFilename = `${userId}-${uuidv4()}.${fileExtension}`;

    // Upload file to Supabase Storage
    const fileUrl = await supabaseService.uploadFile(
      fileBuffer,
      uniqueFilename
    );

    // Update user profile with the new image URL
    const updated = await this.profileRepository.updateProfilePicture(
      userId,
      fileUrl
    );

    const result: UploadProfilePictureResponse = {
      success: true,
      message: "Profile picture uploaded successfully",
      data: {
        profile_picture_url: updated.profile_picture_url!,
      },
    };

    return result;
  }
}
