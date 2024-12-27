import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Book } from "./schemas/book.schema";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { SearchBookDto } from "./dto/search-book.dto";

@Injectable()
export class BookService {

    findByGenre(genre: string, page: number, limit: number) {
        throw new Error("Method not implemented.");
    }

    constructor(
        @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    ) { }

    /**
     * Create a new book
     * @param createBookDto Book creation data
     * @returns Newly created book
     */
    async create(createBookDto: CreateBookDto): Promise<Book> {
        try {
            // Check if book with ISBN already exists
            const existingBook = await this.bookModel
                .findOne({
                    isbn: createBookDto.isbn,
                })
                .exec();

            if (existingBook) {
                throw new BadRequestException("Book with this ISBN already exists");
            }

            const createdBook = new this.bookModel(createBookDto);
            return await createdBook.save();
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException("Failed to create book: " + error.message);
        }
    }

    /**
     * Retrieve all books with pagination
     * @param page Page number (default: 1)
     * @param limit Items per page (default: 10)
     * @returns Paginated books with total count
     */
    async findAll(
        page = 1,
        limit = 10,
    ): Promise<{
        data: Book[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        try {
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
                this.bookModel
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .exec(),
                this.bookModel.countDocuments(),
            ]);

            return {
                data,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            throw new BadRequestException("Failed to fetch books: " + error.message);
        }
    }

    /**
     * Find a book by ID
     * @param id Book ID
     * @returns Book if found
     */
    async findOne(id: string): Promise<Book> {
        try {
            const book = await this.bookModel.findById(id).exec();
            if (!book) {
                throw new NotFoundException(`Book with ID ${id} not found`);
            }
            return book;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException("Failed to fetch book: " + error.message);
        }
    }

    /**
     * Update a book by ID
     * @param id Book ID
     * @param updateBookDto Updated book data
     * @returns Updated book
     */
    async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
        try {
            // If ISBN is being updated, check for duplicates
            if (updateBookDto.isbn) {
                const existingBook = await this.bookModel
                    .findOne({
                        isbn: updateBookDto.isbn,
                        _id: { $ne: id },
                    })
                    .exec();

                if (existingBook) {
                    throw new BadRequestException("Book with this ISBN already exists");
                }
            }

            const updatedBook = await this.bookModel
                .findByIdAndUpdate(id, updateBookDto, { new: true })
                .exec();

            if (!updatedBook) {
                throw new NotFoundException(`Book with ID ${id} not found`);
            }

            return updatedBook;
        } catch (error) {
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }
            throw new BadRequestException("Failed to update book: " + error.message);
        }
    }

    /**
     * Remove a book by ID
     * @param id Book ID
     */
    async remove(id: string): Promise<void> {
        try {
            const result = await this.bookModel.deleteOne({ _id: id }).exec();
            if (result.deletedCount === 0) {
                throw new NotFoundException(`Book with ID ${id} not found`);
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException("Failed to delete book: " + error.message);
        }
    }

    /**
     * Search books using fuzzy matching with SearchBookDto
     * @param searchBookDto Search parameters
     * @returns Matched books
     */
    async search(searchBookDto: SearchBookDto): Promise<Book[]> {
        try {
            const { query } = searchBookDto;

            // Create a fuzzy search regex pattern
            const searchPattern = new RegExp(query.split('').join('.*'), 'i');

            // Query books by title, author, or genre with fuzzy matching
            return await this.bookModel
                .find({
                    $or: [
                        { title: { $regex: searchPattern } },
                        { author: { $regex: searchPattern } },
                        { genre: { $regex: searchPattern } },
                    ],
                })
                .limit(20)
                .exec();
        } catch (error) {
            throw new BadRequestException('Failed to fetch books: ' + error.message);
        }
    }
}
