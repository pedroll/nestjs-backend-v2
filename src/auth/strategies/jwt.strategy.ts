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
    private readonly userRepository: Repository<User>, // Inject the User repository
    private readonly configService: ConfigService, // Inject the ConfigService to access environment variables
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header as a Bearer token
      secretOrKey: configService.get<string>('jwtSecret')!, // Get the JWT secret key from the configuration
    });
  }

  /**
   * Validate the JWT payload and perform additional checks.
   * @param payload - The JWT payload containing user information.
   * @returns The user object if validation is successful.
   * @throws UnauthorizedException if the token is invalid or the user is inactive.
   */
  async validate(payload: JwtPayload) {
    const { id } = payload; // Extract the user ID from the payload
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'isActive', 'roles', 'fullName'], // Select specific fields from the user entity
    });

    if (!user) throw new UnauthorizedException('Token no valido'); // Throw an exception if the user is not found
    if (!user.isActive) throw new UnauthorizedException('Usuario inactivo'); // Throw an exception if the user is inactive

    return user; // Return the user object if validation is successful
  }
}
