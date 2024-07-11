import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../service/user/user.controller";

export const AuthUser = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<User> => {
    switch (context.getType()) {
      case "http":
        const request = context.switchToHttp().getRequest();
        return data ? request.user?.[data] : request.user;
      case "ws":
        const wsRequest = context.switchToWs().getClient();
        return data ? wsRequest?.user?.[data] : wsRequest.user;

      default:
        return undefined;
    }
  },
);
