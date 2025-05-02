import { PrismaClient, User } from "@/generated/prisma";

const prisma = new PrismaClient();

export class UserService {
  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return null;
      }

      // Remove password hash for security
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return null;
      }

      // Remove password hash for security
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    try {
      // Make sure password_hash cannot be updated directly
      if (data.password_hash) {
        delete data.password_hash;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data,
      });

      // Remove password hash for security
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
      return true;
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async getAllUsers(
    page = 1,
    pageSize = 10,
    role?: string
  ): Promise<{ users: User[]; total: number }> {
    try {
      const skip = (page - 1) * pageSize;
      const where = role ? { role: role as any } : {};

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { created_at: "desc" },
        }),
        prisma.user.count({ where }),
      ]);

      // Remove password hash for security
      const usersWithoutPassword = users.map((user) => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        users: usersWithoutPassword as User[],
        total,
      };
    } catch (error: any) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }
}
