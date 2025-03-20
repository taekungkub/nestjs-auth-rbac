import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ Extract token from Authorization header
      ignoreExpiration: false, // ❌ Don't allow expired tokens
      secretOrKey: jwtConstants.secret, // ✅ Secret key for verification
    });
  }

  async validate(payload): Promise<any> {
    return {
      ...payload,
    };
  }
}
