import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ Extract token from Authorization header
      ignoreExpiration: false, // ❌ Don't allow expired tokens
      secretOrKey: configService.get('JWT_SECRET'), // ✅ Secret key for verification
    });
  }

  async validate(payload): Promise<any> {
    return {
      ...payload,
    };
  }
}
