import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import prismaClient from "../../../core/prisma/client";

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

// Define the Token type based on Prisma schema
type Token = {
  id: string;
  token: string;
  user_id: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
  user?: User;
};

export class AuthRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prismaClient;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(
    userData: Omit<User, "id" | "created_at" | "updated_at" | "role">
  ): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async createRefreshToken(userId: string, expiresAt: Date): Promise<Token> {
    const tokenValue = randomBytes(40).toString("hex");

    return this.prisma.token.create({
      data: {
        token: tokenValue,
        user_id: userId,
        expires_at: expiresAt,
      },
    });
  }

  async findRefreshToken(
    token: string
  ): Promise<(Token & { user: User }) | null> {
    return this.prisma.token.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRefreshToken(tokenId: string): Promise<Token> {
    return this.prisma.token.delete({
      where: { id: tokenId },
    });
  }

  async deleteRefreshTokenByValue(token: string): Promise<Token[]> {
    return this.prisma.token.deleteMany({
      where: { token },
    }) as unknown as Token[];
  }
}
