import { Express } from 'express';
import request from 'supertest';
import { createApp } from '../../src/main/app';

describe('Cars API', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  async function createCar(body: Record<string, unknown>) {
    return request(app).post('/cars').send(body);
  }

  it('runs the full CRUD flow', async () => {
    const created = await createCar({ plate: 'abc-1234', color: 'Preto', brand: 'Fiat' });
    expect(created.status).toBe(201);
    expect(created.body).toEqual({ id: expect.any(String), plate: 'ABC1234', color: 'Preto', brand: 'Fiat' });

    const { id } = created.body;

    const fetched = await request(app).get(`/cars/${id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body).toEqual(created.body);

    const updated = await request(app).put(`/cars/${id}`).send({ plate: 'ABC1234', color: 'Branco', brand: 'Fiat' });
    expect(updated.status).toBe(200);
    expect(updated.body.color).toBe('Branco');

    const deleted = await request(app).delete(`/cars/${id}`);
    expect(deleted.status).toBe(204);

    const afterDelete = await request(app).get(`/cars/${id}`);
    expect(afterDelete.status).toBe(404);
  });

  it('filters the list by color and brand', async () => {
    await createCar({ plate: 'AAA1111', color: 'Preto', brand: 'Fiat' });
    await createCar({ plate: 'BBB2222', color: 'Preto', brand: 'Ford' });
    await createCar({ plate: 'CCC3333', color: 'Branco', brand: 'Fiat' });

    const byColor = await request(app).get('/cars').query({ color: 'preto' });
    expect(byColor.body.map((car: { plate: string }) => car.plate)).toEqual(['AAA1111', 'BBB2222']);

    const byBoth = await request(app).get('/cars').query({ color: 'preto', brand: 'fiat' });
    expect(byBoth.body.map((car: { plate: string }) => car.plate)).toEqual(['AAA1111']);
  });

  it('returns 400 with details for invalid data', async () => {
    const response = await createCar({ plate: 'invalid', color: '', brand: 'Fiat' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid car data',
      details: ['plate must follow the format ABC1234, ABC-1234 or ABC1D23', 'color is required'],
    });
  });

  it('returns 400 for a repeated query parameter', async () => {
    const response = await request(app).get('/cars?color=preto&color=branco');

    expect(response.status).toBe(400);
  });

  it('returns 400 for a malformed JSON body', async () => {
    const response = await request(app).post('/cars').set('Content-Type', 'application/json').send('{"plate":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Malformed JSON body' });
  });

  it('returns 409 for a duplicated plate', async () => {
    await createCar({ plate: 'AAA1111', color: 'Preto', brand: 'Fiat' });

    const response = await createCar({ plate: 'aaa-1111', color: 'Branco', brand: 'Ford' });

    expect(response.status).toBe(409);
  });

  it('returns 404 when updating or deleting a missing car', async () => {
    const update = await request(app).put('/cars/missing').send({ plate: 'AAA1111', color: 'Preto', brand: 'Fiat' });
    const remove = await request(app).delete('/cars/missing');

    expect(update.status).toBe(404);
    expect(remove.status).toBe(404);
  });
});
