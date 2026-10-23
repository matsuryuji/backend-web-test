import { Express } from 'express';
import request from 'supertest';
import { createApp } from '../../src/main/app';

describe('Drivers API', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  async function createDriver(body: Record<string, unknown>) {
    return request(app).post('/drivers').send(body);
  }

  it('runs the full CRUD flow', async () => {
    const created = await createDriver({ name: 'João da Silva' });
    expect(created.status).toBe(201);
    expect(created.body).toEqual({ id: expect.any(String), name: 'João da Silva' });

    const { id } = created.body;

    const fetched = await request(app).get(`/drivers/${id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body).toEqual(created.body);

    const updated = await request(app).put(`/drivers/${id}`).send({ name: 'João Pedro' });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('João Pedro');

    const deleted = await request(app).delete(`/drivers/${id}`);
    expect(deleted.status).toBe(204);

    const afterDelete = await request(app).get(`/drivers/${id}`);
    expect(afterDelete.status).toBe(404);
  });

  it('filters the list by part of the name', async () => {
    await createDriver({ name: 'João da Silva' });
    await createDriver({ name: 'Maria Souza' });
    await createDriver({ name: 'Joana Lima' });

    const response = await request(app).get('/drivers').query({ name: 'jo' });

    expect(response.status).toBe(200);
    expect(response.body.map((driver: { name: string }) => driver.name)).toEqual(['João da Silva', 'Joana Lima']);
  });

  it('returns 400 for an invalid name', async () => {
    const response = await createDriver({ name: '' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid driver data', details: ['name is required'] });
  });

  it('returns 404 when updating or deleting a missing driver', async () => {
    const update = await request(app).put('/drivers/missing').send({ name: 'Maria' });
    const remove = await request(app).delete('/drivers/missing');

    expect(update.status).toBe(404);
    expect(remove.status).toBe(404);
  });
});
