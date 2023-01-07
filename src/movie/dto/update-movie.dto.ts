import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { GenderEnum } from 'src/enums';

export class UpdateMovieDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @IsOptional()
  title?: String;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @IsOptional()
  description?: String;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  userId?: Number;

  @IsISO8601(
    { strict: true },
    {
      message:
        'Release date must be a valid date and must be in the format YYYY-MM-DD',
    },
  )
  @IsNotEmpty()
  @IsOptional()
  releaseDate?: String;

  @Min(1)
  @Max(5)
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  rating?: Number;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  @IsOptional()
  gender?: GenderEnum;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  actors?: Array<String>;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  imageUrl?: String;
}
