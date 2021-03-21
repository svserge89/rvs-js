import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';

import {AuthService} from './auth.service';
import {CredentialsDto} from './dto/credentials.dto';
import {TokenResponseDto} from './dto/token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  createToken(
    @Body(new ValidationPipe({transform: true})) credentials: CredentialsDto,
  ): Promise<TokenResponseDto> {
    return this.authService.createToken(credentials);
  }
}
