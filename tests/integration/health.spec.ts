import request from 'supertest';
import { createApp } from '../../src/main/app';

describe('GET /health', () => {
  it('returns status ok', async () => {
    const response = await request(createApp()).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns 404 for unknown routes', async () => {
    const response = await request(createApp()).get('/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Route GET /unknown not found' });
  });
});
