import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(userData: UserRegisterDto): Promise<Partial<UserEntity>> {
    // const {username,password,email} =userData;
    const user = this.userRepository.create({
      ...userData,
    });
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);
    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(
        `Le username et le passwword doivent etre unique `,
      );
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async login(credentials: LoginCredentialsDto) {
    //Recupere le login et le mot de passe
    const { username, password } = credentials;
    //On peut se logger ou via le username ou le password

    //verifie est ce qu'il y a user avec ce login ou ce mdp
    //const user = await this.userRepository.findOne({ where: { username } });
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username or user.email= :username', {
        username,
      })
      .getOne(); //getOne recup one  getMany recup plusieurs aussi on pouvait utiliser setParameters
    //si not je declenche une erreur
    if (!user) throw new NotFoundException('username ou password erronée');
    //Si oui je vérifie est ce que le mot de passe est correct ou pas
    const hashedPassword = await bcrypt.hash(password, user.salt);
    if (hashedPassword === user.password) {
      const payload = {
        username: user.username,
        email: user.email,
        role: user.role,
      };
      const jwt = await this.jwtService.sign(payload);
      return {
        access_token: jwt,
      };
    } else {
      //Si mot de passe incorrect je déclenche une erreur
      throw new NotFoundException('username ou password erronée');
    }
  }
}
