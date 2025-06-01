import { PrismaClient } from "@prisma/client";
import prismaClient from "../../../core/prisma/client";

export class ProfileRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prismaClient;
  }

  /**
   * Find a user profile by user ID
   */
  async findByUserId(userId: string): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  /**
   * Update user profile fields
   */
  async update(userId: string, data: any): Promise<any> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  /**
   * Update only the profile picture URL
   */
  async updateProfilePicture(userId: string, fileUrl: string): Promise<any> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { profile_picture_url: fileUrl },
    });
  }
}
