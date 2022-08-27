import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Roles } from './../decorators/roles.decorator';
import { User } from './../decorators/user.decorator';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  register(@Body() userData: UserSubscribeDto): Promise<Partial<UserEntity>> {
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

  @Post('/pro')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  cone(@Body() credentials: LoginCredentialsDto, @User() user) {
    return user;
  }
}
