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
import { GenderEnum } from '../../enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: String;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: String;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsISO8601(
    { strict: true },
    {
      message:
        'releaseDate must be a valid date and must be in the format YYYY-MM-DD',
    },
  )
  @IsNotEmpty()
  releaseDate: String;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  @Min(1)
  @Max(5)
  @IsNumber()
  @IsNotEmpty()
  rating: Number;

  @ApiProperty({
    enum: GenderEnum,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({
    type: Array<String>,
    description: 'This is a required property',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  actors: Array<String>;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsUrl()
  @IsNotEmpty()
  imageUrl: String;
}
