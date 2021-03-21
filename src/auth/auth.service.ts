import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {UserEntity} from '../user/entity/user.entity';
import {checkPassword} from '../utils/security';
import {CredentialsDto} from './dto/credentials.dto';
import {TokenResponseDto} from './dto/token-response.dto';
import {JwtPayload} from './types/jwt-payload.inteface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createToken({
    userName,
    password,
  }: CredentialsDto): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOne({
      select: ['id', 'encryptedPassword'],
      where: [{nickName: userName}, {email: userName}],
    });

    if (!user || (await checkPassword(password, user.encryptedPassword))) {
      throw new UnauthorizedException('User name or passwort is invalid');
    }

    const payload: JwtPayload = {userId: user.id};
    const token = this.jwtService.sign(payload);

    return {token};
  }
}
