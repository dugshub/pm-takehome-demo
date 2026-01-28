import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateProjectManagerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  department?: string;
}
