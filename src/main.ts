import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle("Library Management API")
    .setDescription("API for managing library books")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions = {
    customSiteTitle: 'Library Management API Documentation',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js'
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css'
    ]
  };

  SwaggerModule.setup("api", app, document, customOptions);

  // Serve OpenAPI document
  app.use('/api.json', (req, res) => {
    res.json(document);
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();