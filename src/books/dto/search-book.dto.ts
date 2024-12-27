import { IsString, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class SearchBookDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly query?: string;
}
