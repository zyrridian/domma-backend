import { Request, ResponseToolkit } from "@hapi/hapi";
import { AuthService } from "../services/auth.service";
import { ResponseUtil } from "../../../common/utils/response.util";
import { LoginDTO, RegisterDTO } from "../dto/auth.dto";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async register(request: Request, h: ResponseToolkit) {
    try {
      await this.authService.register(request.payload as RegisterDTO);
      return h
        .response(ResponseUtil.success(null, "User registered successfully"))
        .code(201);
    } catch (error: any) {
      return h
        .response(
          ResponseUtil.error(
            error.message,
            "REGISTRATION_FAILED",
            error.details
          )
        )
        .code(400);
    }
  }

  public async login(request: Request, h: ResponseToolkit) {
    try {
      const result = await this.authService.login(request.payload as LoginDTO);
      return h
        .response(ResponseUtil.success(result, "Login successful"))
        .code(200);
    } catch (error: any) {
      return h
        .response(
          ResponseUtil.error(error.message, "LOGIN_FAILED", error.details)
        )
        .code(401);
    }
  }

  public async refreshToken(request: Request, h: ResponseToolkit) {
    try {
      const { refresh_token } = request.payload as any;
      const result = await this.authService.refreshToken(refresh_token);
      return h
        .response(ResponseUtil.success(result, "Token refreshed successfully"))
        .code(200);
    } catch (error: any) {
      return h
        .response(ResponseUtil.error(error.message, "TOKEN_REFRESH_FAILED"))
        .code(401);
    }
  }

  public async logout(request: Request, h: ResponseToolkit) {
    try {
      const { refresh_token } = request.payload as any;
      await this.authService.logout(refresh_token);
      return h
        .response(ResponseUtil.success(null, "Logged out successfully"))
        .code(200);
    } catch (error: any) {
      return h
        .response(ResponseUtil.error(error.message, "LOGOUT_FAILED"))
        .code(400);
    }
  }

  public async getProfile(request: Request, h: ResponseToolkit) {
    try {
      const userId = request.auth.credentials.id as string;
      const user = await this.authService.getCurrentUser(userId);

      if (!user) {
        return h
          .response(ResponseUtil.error("User not found", "USER_NOT_FOUND"))
          .code(404);
      }

      return h
        .response(ResponseUtil.success(user, "Profile retrieved successfully"))
        .code(200);
    } catch (error: any) {
      return h
        .response(ResponseUtil.error(error.message, "PROFILE_FETCH_FAILED"))
        .code(500);
    }
  }

  public async updateProfile(request: Request, h: ResponseToolkit) {
    try {
      const userId = request.auth.credentials.id as string;
      const updatedUser = await this.authService.updateProfile(
        userId,
        request.payload as any
      );

      return h
        .response(
          ResponseUtil.success(updatedUser, "Profile updated successfully")
        )
        .code(200);
    } catch (error: any) {
      return h
        .response(ResponseUtil.error(error.message, "PROFILE_UPDATE_FAILED"))
        .code(400);
    }
  }

  public async changePassword(request: Request, h: ResponseToolkit) {
    try {
      const userId = request.auth.credentials.id as string;
      const { currentPassword, newPassword } = request.payload as any;

      await this.authService.changePassword(
        userId,
        currentPassword,
        newPassword
      );

      return h
        .response(ResponseUtil.success(null, "Password changed successfully"))
        .code(200);
    } catch (error: any) {
      return h
        .response(ResponseUtil.error(error.message, "PASSWORD_CHANGE_FAILED"))
        .code(400);
    }
  }
}
