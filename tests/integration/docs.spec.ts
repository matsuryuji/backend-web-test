import request from 'supertest';
import { createApp } from '../../src/main/app';

describe('API docs', () => {
  it('serves the OpenAPI document with every resource', async () => {
    const response = await request(createApp()).get('/docs/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.3');
    expect(Object.keys(response.body.paths)).toEqual([
      '/cars',
      '/cars/{id}',
      '/drivers',
      '/drivers/{id}',
      '/car-usages',
      '/car-usages/{id}/finish',
    ]);
  });

  it('serves the Swagger UI', async () => {
    const response = await request(createApp()).get('/docs/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('swagger-ui');
  });
});
