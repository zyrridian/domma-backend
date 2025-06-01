export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  university: string;
  major: string;
  created_at: string;
  updated_at: string;
  profile_picture_url: string | null;
}

export interface GetProfileResponse {
  success: true;
  data: UserProfile;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string | null;
  university?: string;
  major?: string;
  profile_picture_url?: string | null;
}

export interface UpdateProfileResponse {
  success: true;
  message: string;
  data: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    university: string;
    major: string;
    updated_at: string;
    profile_picture_url: string | null;
  };
}

export interface UploadProfilePictureResponse {
  success: true;
  message: string;
  data: {
    profile_picture_url: string;
  };
}
