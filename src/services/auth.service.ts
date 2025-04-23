import { PrismaClient, User } from "@/generated/prisma";
import bcrypt from "bcrypt";
import sign from "@hapi/jwt";
import { config } from "../config";

const prisma = new PrismaClient();

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  async register(input: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
      },
    });

    return user;
  }

  async login(input: LoginInput): Promise<{ token: string; user: User }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 60 * 60;

    const token = sign.token.generate(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        iat: now,
        exp: now + expiresIn,
      },
      config.jwt.secret
    );

    return { token, user };
  }
}
