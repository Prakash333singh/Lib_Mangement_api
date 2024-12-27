
import { IsString, IsNumber, IsISBN, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly author: string;

  @ApiProperty()
  @IsString()
  readonly genre: string;

  @ApiProperty()
  @IsNumber()
  readonly publishedYear: number;

  @ApiProperty()
  @IsISBN()
  readonly isbn: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  readonly stockCount: number;
}
