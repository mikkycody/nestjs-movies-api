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
import { GenderEnum } from '../../enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMovieDto {
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @IsOptional()
  title?: String;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @IsOptional()
  description?: String;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsISO8601(
    { strict: true },
    {
      message:
        'releaseDate must be a valid date and must be in the format YYYY-MM-DD',
    },
  )
  @IsNotEmpty()
  @IsOptional()
  releaseDate?: String;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @Min(1)
  @Max(5)
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  rating?: Number;

  @ApiPropertyOptional({
    enum: GenderEnum,
    description: 'This is an optional property',
  })
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  @IsOptional()
  gender?: GenderEnum;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  actors?: Array<String>;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  imageUrl?: String;
}
