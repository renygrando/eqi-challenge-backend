import { Type } from "class-transformer";
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsISO8601,
  ValidateNested,
  IsNotEmpty,
} from "class-validator";

enum ChannelEnum {
  GOOGLE_ADS = "google-ads",
  META_ADS = "meta-ads",
  ORGANIC = "organic",
  EMAIL_CAMPAIGN = "email-campaign",
  REFERRAL = "referral",
  DIRECT = "direct",
}

export class PersonalDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class AcquisitionDto {
  @IsEnum(ChannelEnum)
  channel: string;

  @IsOptional()
  @IsString()
  campaign_id?: string;

  @IsOptional()
  @IsString()
  landing_page?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;
}

export class MetadataDto {
  @IsISO8601()
  received_at: string;

  @IsString()
  @IsNotEmpty()
  version: string;
}

export class LeadDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested()
  @Type(() => PersonalDto)
  personal: PersonalDto;

  @ValidateNested()
  @Type(() => AcquisitionDto)
  acquisition: AcquisitionDto;

  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto;
}

export class LeadflowV2WebhookDto {
  @ValidateNested()
  @Type(() => LeadDto)
  lead: LeadDto;
}
