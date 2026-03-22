import {
  UnauthorizedException,
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { SupabasePerRequestService } from '../supabase/supabase-per-request-service';

@Injectable()
export class SupabaseTokenGuard implements CanActivate {
  constructor(private readonly sbPerRequest: SupabasePerRequestService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers?.authorization as string | undefined;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (!token) {
      throw new UnauthorizedException('Malformed Authorization header');
    }

    const user = await this.sbPerRequest.verifyTokenAndGetUser(token);
    if (!user?.id) {
      throw new UnauthorizedException('Invalid token');
    }

    req.user = { id: user.id, email: user.email };
    req.supabaseClient = this.sbPerRequest.getClientFromToken(token);
    return true;
  }
}
