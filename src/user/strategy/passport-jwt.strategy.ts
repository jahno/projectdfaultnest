import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { UserEntity } from './../entities/user.entity';
import { PayloadInterface } from './../interfaces/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('SECRET'),
    });
  }

  async validate(payload: PayloadInterface) {
    //je recupere mon user
    const user = await this.userRepository.findOne({
      where: { username: payload.username },
    });

    // si le user existe je le retourne dans le request
    if (user) {
      const { password, salt, ...result } = user;
      return result;
    } else {
      //sinon je declenche une erreur
      throw new UnauthorizedException();
    }

    //return { userId: payload.sub, username: payload.username };
  }
}
