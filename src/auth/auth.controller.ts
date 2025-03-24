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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserRoleGuard } from './guards/user-role.guard';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateAuthDto } from './dto';
import { Auth, GetRawHeaders, GetUser, RoleProtected } from './decorators';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user.
   * @param createUserDto - Data Transfer Object containing user registration details.
   * @returns The created user.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  /**
   * Log in a user.
   * @param loginUserDto - Data Transfer Object containing user login details.
   * @returns The logged-in user with a JWT token.
   */
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({
    status: 200,
    description: 'The authentication status has been successfully checked.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Access a private route' })
  @ApiResponse({
    status: 200,
    description: 'Access to the private route granted.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({
    summary: 'Access a private route with role-based authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Access to the private route granted.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({
    summary: 'Access a private route with role-based authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Access to the private route granted.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  private3(@GetUser() user: User) {
    console.log(user);
    return {
      ok: true,
      message: 'This is a private route',
      user,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all auth records' })
  @ApiResponse({ status: 200, description: 'Return all auth records' })
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an auth record by ID' })
  @ApiParam({ name: 'id', description: 'Auth record ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the auth record',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Auth record not found' })
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an auth record' })
  @ApiParam({ name: 'id', description: 'Auth record ID' })
  @ApiResponse({
    status: 200,
    description: 'The auth record has been successfully updated.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an auth record' })
  @ApiParam({ name: 'id', description: 'Auth record ID' })
  @ApiResponse({
    status: 200,
    description: 'The auth record has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Auth record not found' })
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
