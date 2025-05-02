export interface RegisterDTO {
  full_name: string;
  university: string;
  major: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refresh_token: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface TokenResponseDTO {
  access_token: string;
  refresh_token: string;
  user: UserDTO;
}

export interface UserDTO {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  university?: string;
  major?: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
