import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginCredentialsDto {
  @ApiProperty({
    description: 'ja',
    example: 'jahno',
  })
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
