import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LeadflowV1WebhookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  source: string;
}
