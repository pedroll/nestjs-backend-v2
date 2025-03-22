import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from './guards/user-role.guard';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateAuthDto } from './dto';
import { Auth, GetRawHeaders, GetUser, RoleProtected } from './decorators';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user.
   * @param createUserDto - Data Transfer Object containing user registration details.
   * @returns The created user.
   */
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  /**
   * Log in a user.
   * @param loginUserDto - Data Transfer Object containing user login details.
   * @returns The logged-in user with a JWT token.
   */
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
  /**
   * Access a private route.
   * @param user - The authenticated user.
   * @param userEmail - The email of the authenticated user.
   * @param rawHeaders - The raw headers of the request.
   * @param headers - The headers of the request.
   * @returns An object containing user details and request headers.
   */
  @Get('private')
  @UseGuards(AuthGuard())
  private(
    // @Req() req: Express.Request
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log(req.user);
    console.log(user);
    return {
      ok: true,
      message: 'This is a private route',
      user,
      userEmail,
      headers,
      rawHeaders,
    };
  }

  /**
   * Access a private route with role-based authorization.
   * @param user - The authenticated user.
   * @returns An object containing user details.
   */
  @Get('private2')
  // @SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected(ValidRoles.SUPER_USER)
  @UseGuards(AuthGuard(), UserRoleGuard)
  private2(@GetUser() user: User) {
    console.log(user);
    return {
      ok: true,
      message: 'This is a private route',
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.SUPER_USER, ValidRoles.ADMIN)
  private3(@GetUser() user: User) {
    console.log(user);
    return {
      ok: true,
      message: 'This is a private route',
      user,
    };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
