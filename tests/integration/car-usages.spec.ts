import { Express } from 'express';
import request from 'supertest';
import { createApp } from '../../src/main/app';

describe('Car usages API', () => {
  let app: Express;
  let carId: string;
  let otherCarId: string;
  let driverId: string;
  let otherDriverId: string;

  beforeEach(async () => {
    app = createApp();
    carId = (await request(app).post('/cars').send({ plate: 'AAA1111', color: 'Preto', brand: 'Fiat' })).body.id;
    otherCarId = (await request(app).post('/cars').send({ plate: 'BBB2222', color: 'Branco', brand: 'Ford' })).body.id;
    driverId = (await request(app).post('/drivers').send({ name: 'João' })).body.id;
    otherDriverId = (await request(app).post('/drivers').send({ name: 'Maria' })).body.id;
  });

  function startUsage(body: Record<string, unknown>) {
    return request(app).post('/car-usages').send(body);
  }

  it('starts, lists and finishes a usage', async () => {
    const started = await startUsage({
      carId,
      driverId,
      reason: 'Visita ao cliente',
      startDate: '2026-10-20T08:00:00.000Z',
    });

    expect(started.status).toBe(201);
    expect(started.body).toEqual({
      id: expect.any(String),
      reason: 'Visita ao cliente',
      startDate: '2026-10-20T08:00:00.000Z',
      endDate: null,
      driver: { id: driverId, name: 'João' },
      car: { id: carId, plate: 'AAA1111', color: 'Preto', brand: 'Fiat' },
    });

    const listed = await request(app).get('/car-usages');
    expect(listed.status).toBe(200);
    expect(listed.body).toEqual([started.body]);

    const finished = await request(app)
      .patch(`/car-usages/${started.body.id}/finish`)
      .send({ endDate: '2026-10-20T18:00:00.000Z' });

    expect(finished.status).toBe(200);
    expect(finished.body.endDate).toBe('2026-10-20T18:00:00.000Z');
  });

  it('uses the current date when no date is informed', async () => {
    const before = Date.now();

    const started = await startUsage({ carId, driverId, reason: 'Visita' });
    const finished = await request(app).patch(`/car-usages/${started.body.id}/finish`);

    expect(new Date(started.body.startDate).getTime()).toBeGreaterThanOrEqual(before);
    expect(new Date(finished.body.endDate).getTime()).toBeGreaterThanOrEqual(
      new Date(started.body.startDate).getTime(),
    );
  });

  it('returns 409 when the car is already in use', async () => {
    await startUsage({ carId, driverId, reason: 'Visita' });

    const response = await startUsage({ carId, driverId: otherDriverId, reason: 'Entrega' });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: `Car "${carId}" is already in use during this period` });
  });

  it('returns 409 when the driver is already using another car', async () => {
    await startUsage({ carId, driverId, reason: 'Visita' });

    const response = await startUsage({ carId: otherCarId, driverId, reason: 'Entrega' });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: `Driver "${driverId}" is already using a car during this period` });
  });

  it('returns 409 when finishing a usage twice', async () => {
    const started = await startUsage({ carId, driverId, reason: 'Visita' });
    await request(app).patch(`/car-usages/${started.body.id}/finish`);

    const response = await request(app).patch(`/car-usages/${started.body.id}/finish`);

    expect(response.status).toBe(409);
  });

  it('returns 400 for invalid data', async () => {
    const missingFields = await startUsage({});
    const invalidDate = await startUsage({ carId, driverId, reason: 'Visita', startDate: 'yesterday' });

    expect(missingFields.status).toBe(400);
    expect(missingFields.body.details).toEqual(['carId is required', 'driverId is required', 'reason is required']);
    expect(invalidDate.status).toBe(400);
    expect(invalidDate.body.details).toEqual(['startDate must be a valid ISO 8601 date']);
  });

  it('returns 400 when the end date is before the start date', async () => {
    const started = await startUsage({ carId, driverId, reason: 'Visita', startDate: '2026-10-20T08:00:00.000Z' });

    const response = await request(app)
      .patch(`/car-usages/${started.body.id}/finish`)
      .send({ endDate: '2026-10-19T08:00:00.000Z' });

    expect(response.status).toBe(400);
  });

  it('returns 404 for a missing car, driver or usage', async () => {
    const missingCar = await startUsage({ carId: 'missing', driverId, reason: 'Visita' });
    const missingDriver = await startUsage({ carId, driverId: 'missing', reason: 'Visita' });
    const missingUsage = await request(app).patch('/car-usages/missing/finish');

    expect(missingCar.status).toBe(404);
    expect(missingDriver.status).toBe(404);
    expect(missingUsage.status).toBe(404);
  });

  it('returns 409 when deleting a car or driver that has usage records', async () => {
    await startUsage({ carId, driverId, reason: 'Visita' });

    const deleteCar = await request(app).delete(`/cars/${carId}`);
    const deleteDriver = await request(app).delete(`/drivers/${driverId}`);

    expect(deleteCar.status).toBe(409);
    expect(deleteDriver.status).toBe(409);
  });
});
