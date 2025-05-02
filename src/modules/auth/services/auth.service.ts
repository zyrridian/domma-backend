import bcrypt from "bcrypt";
import jwt from "@hapi/jwt";
import { AuthRepository } from "../repositories/auth.repository";
import {
  LoginDTO,
  RegisterDTO,
  TokenResponseDTO,
  UserDTO,
} from "../dto/auth.dto";
import { AppConfig } from "../../../common/config/app.config";

// Define the User type based on Prisma schema
type User = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string | null;
  university?: string | null;
  major?: string | null;
  created_at: Date;
  updated_at: Date;
  role: string;
};

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(input: RegisterDTO): Promise<UserDTO> {
    // Check if user with this email already exists
    const existingUser = await this.authRepository.findUserByEmail(input.email);

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const { password, ...userData } = input; // Remove password

    try {
      const user = await this.authRepository.createUser({
        ...userData,
        password_hash: hashedPassword,
      });

      return this.mapUserToDTO(user);
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async login(input: LoginDTO): Promise<TokenResponseDTO> {
    const user = await this.authRepository.findUserByEmail(input.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
      input.password,
      user.password_hash
    );

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate access token
    const accessToken = this.generateAccessToken(user);

    // Generate refresh token
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: this.mapUserToDTO(user),
    };
  }

  async refreshToken(token: string): Promise<{ access_token: string }> {
    // Find the token in the database
    const savedToken = await this.authRepository.findRefreshToken(token);

    if (!savedToken) {
      throw new Error("Invalid refresh token");
    }

    // Check if token is expired
    if (new Date() > savedToken.expires_at) {
      // Delete the expired token
      await this.authRepository.deleteRefreshToken(savedToken.id);
      throw new Error("Refresh token expired");
    }

    // Generate a new access token
    const accessToken = this.generateAccessToken(savedToken.user);

    return { access_token: accessToken };
  }

  async logout(refreshToken: string): Promise<boolean> {
    try {
      // Delete the refresh token from the database
      await this.authRepository.deleteRefreshTokenByValue(refreshToken);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getCurrentUser(userId: string): Promise<UserDTO | null> {
    try {
      const user = await this.authRepository.findUserById(userId);

      if (!user) {
        return null;
      }

      return this.mapUserToDTO(user);
    } catch (error) {
      throw new Error("Failed to fetch user profile");
    }
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<UserDTO> {
    try {
      // Ensure password_hash can't be updated directly
      if (data.password_hash) {
        delete data.password_hash;
      }

      const user = await this.authRepository.updateUser(userId, data);
      return this.mapUserToDTO(user);
    } catch (error: any) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.authRepository.updateUser(userId, {
      password_hash: hashedPassword,
    });

    return true;
  }

  // Helper methods
  private generateAccessToken(user: User): string {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60; // 1 hour

    return jwt.token.generate(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        iat: now,
        exp: now + expiresIn,
      },
      AppConfig.jwt.secret
    );
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create a token in the database
    const token = await this.authRepository.createRefreshToken(
      userId,
      expiresAt
    );

    return token.token;
  }

  private mapUserToDTO(user: User): UserDTO {
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword as unknown as UserDTO;
  }
}
