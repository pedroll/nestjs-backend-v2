import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwtSecret')!,
    });
  }

  // una vez validado el token, se ejecuta el métod validate con nuestras validaciones extras como isActive
  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'isActive'],
    });

    if (!user) throw new UnauthorizedException('Token no valido');
    if (!user.isActive) throw new UnauthorizedException('Usuario inactivo');

    return user;
  }
}
