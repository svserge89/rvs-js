import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {InjectRepository} from '@nestjs/typeorm';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Repository} from 'typeorm';

import {UserEntity} from '../user/entity/user.entity';
import {UserRole} from '../user/types/user-role.enum';
import {JWT_SECRET} from '../utils/security';
import {InvalidTokenException} from './exception/invalid-token.exception';
import {JwtPayload} from './types/jwt-payload.inteface';
import {UserPayload} from './types/user-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate({userId}: JwtPayload): Promise<UserPayload> {
    const user = await this.userRepository.findOne(userId, {
      select: ['id', 'roles'],
    });

    if (!user) {
      throw new InvalidTokenException();
    }

    return {
      id: user.id,
      isUser: user.roles.includes(UserRole.USER),
      isAdmin: user.roles.includes(UserRole.ADMIN),
    };
  }
}
