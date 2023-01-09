import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { GenderEnum } from '../../tmp/enums';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: String;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: String;

  @IsISO8601(
    { strict: true },
    {
      message:
        'releaseDate must be a valid date and must be in the format YYYY-MM-DD',
    },
  )
  @IsNotEmpty()
  releaseDate: String;

  @Min(1)
  @Max(5)
  @IsNumber()
  @IsNotEmpty()
  rating: Number;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  actors: Array<String>;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: String;
}
