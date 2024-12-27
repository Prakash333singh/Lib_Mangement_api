# Library Management API

## Overview

This NestJS-based Book Management API provides a robust backend solution for managing book collections with advanced features like pagination, logging, and fuzzy search.

## Prerequisites

- Node.js (v16+ recommended)
- npm or Yarn
- MongoDB (recommended database)

## Tech Stack

- NestJS
- TypeScript
- MongoDB
- Mongoose

## Project Structure

```
├── main.ts                   # Application entry point
├── app.module.ts             # Root application module
├── common/                   # Shared utilities and cross-cutting concerns
│   ├── decorators/           # Custom decorators
│   ├── interceptors/         # Request/response interceptors
│   └── middleware/           # Request processing middleware
├── config/                   # Configuration files
│   ├── database.config.ts    # Database connection settings
│   └── configuration.ts      # Application configuration
├── books/                    # Book module
│   ├── book.module.ts        # Book module definition
│   ├── book.controller.ts    # HTTP request handlers
│   ├── book.service.ts       # Business logic
│   ├── schemas/              # Database schemas
│   ├── dto/                  # Data transfer objects
│   └── interfaces/           # TypeScript interfaces
└── utils/                    # Utility functions
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/bookdb
PORT=4000
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

## API Endpoints

### Books

- `GET /books`: Retrieve all books
- `GET /books/:id`: Retrieve a specific book
- `POST /books`: Create a new book
- `PATCH /books/:id`: Update an existing book
- `DELETE /books/:id`: Delete a book
- `GET /books/:search`: Search a book by author, title, or genre

## Features

- 🚀 Pagination support
- 🔍 Fuzzy search functionality
- 📝 Comprehensive logging
- 🛡️ Input validation
- 🔒 Error handling

## Middleware

- Request logging
- Response transformation
- Pagination decorator

## Utilities

- Fuzzy search utility for flexible book searching

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## Deployment

### Vercel Deployment

- **Error**: The static folder is not being served correctly in the Vercel deployment.
- **Working Locally**: Everything works fine when running the application locally, but there is an issue in serving the static files after deploying on Vercel.
- **Other Endpoints**: Other endpoints are working as expected. You can access the API here:  
  [Library Management API on Vercel](https://lib-management-api-k2qr-hfj1cfft5-prakash333singhs-projects.vercel.app/)

## Swagger UI

You can view the API documentation in Swagger UI. Below is an image of how it looks.

![swagger image](<Screenshot 2024-12-26 234032.png>)

### Swagger UI Link

[Swagger UI Documentation](https://lib-management-api-k2qr-hfj1cfft5-prakash333singhs-projects.vercel.app/api)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Contribution Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Maintain consistent code style
- Update documentation

## Performance Optimization

- Implemented logging interceptors
- Fuzzy search for efficient querying
- Pagination to manage large datasets

## Security

- Input validation
- Error handling
- Middleware for request logging

## Troubleshooting

- Ensure MongoDB is running
- Check network configurations
- Validate environment variables

## License

MIT License

## Contact

For questions or support, please open an issue on GitHub or contact [Your Email].

---

```

```
