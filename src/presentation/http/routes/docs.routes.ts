import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from '../docs/openapi';

export const docsRoutes = Router();

docsRoutes.get('/openapi.json', (_req, res) => {
  res.json(openApiDocument);
});

docsRoutes.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocument));
