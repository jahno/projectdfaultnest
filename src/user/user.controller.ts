import { UserRoleEnum } from './../enums/user-role.enum';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from './../decorators/roles.decorator';
import { User } from './../decorators/user.decorator';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { UserRegisterDto } from './dto/user-register.dto';

import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: '',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User exists',
  })
  register(@Body() userData: UserRegisterDto): Promise<Partial<UserEntity>> {
    return this.userService.register(userData);
  }

  @Post('/login')
  login(@Body() credentials: LoginCredentialsDto) {
    return this.userService.login(credentials);
  }

  // @Post('/pro')
  // @UseGuards(JwtAuthGuard)
  // cone(@Body() credentials: LoginCredentialsDto, @Req() request: Request) {
  //   console.log(request.user);
  //   return 'oui';
  // }

  @ApiBearerAuth('JWT-auth')
  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  profile(@User() user: UserEntity) {
    return user;
  }

  //   @ApiTags('Admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get admin section' })
  @Get('/admin')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  cone(@User() user: UserEntity) {
    return user;
  }
}
