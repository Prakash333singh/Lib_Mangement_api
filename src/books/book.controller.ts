import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  HttpStatus,
  ValidationPipe,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { SearchBookDto } from "./dto/search-book.dto";
import { Book } from "./schemas/book.schema";
import { TransformInterceptor } from "../common/interceptors/transform.interceptor";
import { LoggingInterceptor } from "../common/interceptors/logging.interceptor";
import { ThrottlerGuard } from "@nestjs/throttler";
import { ApiPaginationQuery } from "../common/decorators/api-pagination.decorator";

@ApiTags("books")
@Controller("books")
@UseInterceptors(TransformInterceptor, LoggingInterceptor)
@UseGuards(ThrottlerGuard)
@ApiBearerAuth()
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post()
  @ApiOperation({ summary: "Create a new book" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The book has been successfully created.",
    type: Book,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data.",
  })
  async create(
    @Body(new ValidationPipe({ transform: true })) createBookDto: CreateBookDto
  ): Promise<Book> {
    return await this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all books with pagination" })
  @ApiPaginationQuery()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all books with pagination.",
    type: [Book],
  })
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.bookService.findAll(page, limit);
  }

  // Update the search endpoint to use SearchBookDto
  @Get("search")
  @ApiOperation({ summary: "Search books by title, author, or genre" })
  @ApiQuery({ name: 'query', required: true, description: 'Search term' })
  @ApiResponse({
    status: 200,
    description: "List of books matching the search query.",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid search query.",
  })
  async searchBooks(
    @Query(new ValidationPipe({ transform: true })) searchBookDto: SearchBookDto
  ): Promise<Book[]> {
    const { query } = searchBookDto;

    if (!query || query.trim().length === 0) {
      throw new BadRequestException("Search query cannot be empty.");
    }

    // Pass the full DTO (searchBookDto) instead of just 'query'
    return this.bookService.search(searchBookDto);
  }


  @Get(":id")
  @ApiOperation({ summary: "Get a book by ID" })
  @ApiParam({ name: "id", description: "Book ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the book.",
    type: Book,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Book not found.",
  })
  async findOne(@Param("id") id: string): Promise<Book> {
    return await this.bookService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a book" })
  @ApiParam({ name: "id", description: "Book ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The book has been successfully updated.",
    type: Book,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Book not found.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data.",
  })
  async update(
    @Param("id") id: string,
    @Body(new ValidationPipe({ transform: true })) updateBookDto: UpdateBookDto
  ): Promise<Book> {
    return await this.bookService.update(id, updateBookDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a book" })
  @ApiParam({ name: "id", description: "Book ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The book has been successfully deleted.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Book not found.",
  })
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.bookService.remove(id);
    return { message: `Book with ID ${id} has been successfully deleted.` };
  }
}
